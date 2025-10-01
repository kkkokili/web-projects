// app.js
// jshint esversion:6
require('dotenv').config();

const express = require('express');
const app = express();
const ejs = require('ejs');

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
const MongoDBStoreFactory = require('connect-mongodb-session');
// ❌ 已移除：mongoose-findorcreate
const passportLocalMongoose = require('passport-local-mongoose');

// --------------------- Server Setup ---------------------
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// --------------------- DB & Session ---------------------
const USER = 'admin-xiaotong';
const PASS = encodeURIComponent(process.env.PASSWORD);
const SRV = `mongodb+srv://${USER}:${PASS}@cluster0.irgncm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(SRV, { dbName: 'userDB' })
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo connect error:', e));

const MongoDBStore = MongoDBStoreFactory(session);
const store = new MongoDBStore({
  uri: SRV,
  databaseName: 'connect_mongodb_session_test',
  collection: 'mySessions',
  connectionOptions: {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    tls: true,
    family: 4,
  },
});
store.on('error', (err) => console.error('Session store error:', err));

app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 天
  }),
);

// --------------------- Passport ---------------------
app.use(passport.initialize());
app.use(passport.session());

// User model
const Userschema = new mongoose.Schema({
  email: String,
  password: String,
  secret: [String],
  googleId: String,
  username: String,
});
Userschema.plugin(passportLocalMongoose);

// ✅ 自定义 findOrCreate（兼容 Mongoose 8）
Userschema.statics.findOrCreate = async function (filter, doc = {}) {
  const found = await this.findOne(filter).exec();
  if (found) return { doc: found, created: false };
  const created = await this.create({ ...filter, ...doc });
  return { doc: created, created: true };
};

// 针对 Google 登录的“找或建并绑定”
Userschema.statics.findOrCreateByGoogle = async function (profile) {
  const email = profile.emails?.[0]?.value;

  // 1) 先按 googleId 找（已绑定过）
  let user = await this.findOne({ googleId: profile.id }).exec();
  if (user) return { doc: user, created: false, linked: false };

  // 2) 再按 username/email 找（本地注册过，但未绑定 Google）
  if (email) {
    user = await this.findOne({ username: email }).exec();
    if (user) {
      user.googleId = profile.id; // 绑定 googleId
      await user.save();
      return { doc: user, created: false, linked: true };
    }
  }

  // 3) 都没有就创建
  const created = await this.create({
    googleId: profile.id,
    username: email || `google_${profile.id}`, // 万一拿不到 email 也不阻塞
  });
  return { doc: created, created: true, linked: false };
};

const User = mongoose.model('User', Userschema);

// 本地策略
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== Google OAuth（本地/线上自动切换）=====
// ===== Google OAuth（本地/线上自动切换）=====
const BASE_URL = (
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`
).replace(/\/+$/, ''); // 去掉末尾斜杠，避免 //auth
console.log('Google OAuth callbackURL =', `${BASE_URL}/auth/google/secrets`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/secrets`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { doc: user } = await User.findOrCreateByGoogle(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// --------------------- Routes ---------------------
app.get('/', (req, res) => res.render('home'));

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (_req, res) => res.redirect('/secrets'),
);

app.get('/login', (_req, res) => res.render('login'));
app.get('/register', (_req, res) => res.render('register'));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await new Promise((resolve, reject) =>
      User.register({ username, active: false }, password, (err) =>
        err ? reject(err) : resolve(),
      ),
    );
    passport.authenticate('local')(req, res, () => res.redirect('/secrets'));
  } catch (e) {
    console.error(e);
    res.redirect('/register');
  }
});

app.post('/login', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) return next(err);
    passport.authenticate('local')(req, res, () => res.redirect('/secrets'));
  });
});

// 完整登出：logout + destroy session + clear cookie
app.get('/logout', (req, res, next) => {
  const finish = () => {
    req.session.destroy((err2) => {
      if (err2) return next(err2);
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  };
  try {
    if (typeof req.logout === 'function') {
      return req.logout.length
        ? req.logout((err) => (err ? next(err) : finish()))
        : (req.logout(), finish());
    }
    return finish();
  } catch (e) {
    return next(e);
  }
});

app.get('/secrets', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  try {
    const foundUsers = await User.find({ secret: { $ne: null } }).lean();
    res.render('secrets', { usersWithSecrets: foundUsers || [] });
  } catch (e) {
    console.error(e);
    res.redirect('/login');
  }
});

app.get('/submit', (req, res) =>
  req.isAuthenticated() ? res.render('submit') : res.redirect('/login'),
);

app.post('/submit', async (req, res) => {
  const submittedSecret = req.body.secret;
  try {
    const doc = await User.findById(req.user.id);
    if (!doc) return res.redirect('/login');
    doc.secret.push(submittedSecret);
    await doc.save();
    res.redirect('/secrets');
  } catch (e) {
    console.error(e);
    res.redirect('/login');
  }
});

// 健康检查
app.get('/healthz', (_req, res) => res.send('ok'));

// --------------------- Start ---------------------
app.listen(process.env.PORT || 3000, () => {
  console.log('Port 3000 has started to listen!');
});
