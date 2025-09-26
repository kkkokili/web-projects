//jshint esversion:6

// ------------IMPORT ALL THE USEFUL MODULES SATRT------------------------------
require('dotenv').config();

const express = require("express");

const app = express();

const ejs = require("ejs");

const mongoose = require("mongoose");

const session = require('express-session');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const MongoDBStore = require('connect-mongodb-session')(session);

// package that enpower us to use findOrCreate function
const findOrCreate = require('mongoose-findorcreate');

// const HttpsProxyAgent = require('https-proxy-agent');

// ---------------------Server Setup Template START-----------------------------

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// -------------------------------use connect-mongodb-session to store session----

var store = new MongoDBStore({
  uri: `mongodb+srv://admin-xiaotong:${process.env.PASSWORD}@cluster0.k4lze.mongodb.net/connect_mongodb_session_test`,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  store: store,
  saveUninitialized: false,
  cookie: {
    // when  secure is set, and you access your site over HTTP, the cookie will not be set.
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 /*1 week*/
  }
}));

// -------------------------passport & passport local configure---------------------

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, result) {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!result.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, result);
    });
  }
));

// ----------------------------passport-local-mongoose configure-----------------

mongoose.connect(`mongodb+srv://admin-xiaotong:${process.env.PASSWORD}@cluster0.k4lze.mongodb.net/userDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const passportLocalMongoose = require('passport-local-mongoose');

const Userschema = new mongoose.Schema({
  email: String,
  password: String,
  secret: Array
});

// hash and salt our pwds and to save our users into our mongoDB database
Userschema.plugin(passportLocalMongoose);

Userschema.plugin(findOrCreate);

const User = mongoose.model('User', Userschema);

passport.use(User.createStrategy());


// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });


// serializeUser determines which data of the user object should be stored in the session.
passport.serializeUser(User.serializeUser());

/* When you set in done(null, user) in deserializeUser
where 'user' is some user object from your database:
 this.req.user OR this.passport.user*/
passport.deserializeUser(User.deserializeUser());

// --------------------------------Passport Google Strategy Config--------------

const gStrategy = new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // callbackURL: "https://nameless-hamlet-51427.herokuapp.com/auth/google/secrets"
    callbackURL: "http://localhost:3000/auth/google/secrets"

  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id,
      username: profile.emails[0].value
    }, function(err, user) {
      return cb(err, user);
    });
  }
);

// const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://172.217.160.74:443");
// gStrategy._oauth2.setAgent(agent);
passport.use(gStrategy);

// -----------------------route--------------------------------------------------

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/auth/google',
  passport.authenticate("google", {
    scope: ['profile']
  }));

app.get('/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    User.find({
      "secret": {
        $ne: null
      }
    }, (err, foundUsers) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("secrets", {
            usersWithSecrets: foundUsers
          });
        }
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/submit', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
});

app.post('/submit', (req, res) => {
  const submittedSecret = req.body.secret;

  User.findById(req.user.id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result) {
      result.secret.push(submittedSecret);
        result.save(() => {
          res.redirect('/secrets');
        });
      }
    }
  });

});

app.post('/login', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.passwprd
  });

  req.login(user, function(err) {
    if (err) {
      console.error(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      });
    }
  });
});



app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.register({
    username: username,
    active: false
  }, password, function(err, result) {
    if (err) {
      console.error(err);
      res.redirect('/register');
    } else {
      passport.authenticate("local")(req, res, () => {

        res.redirect("/secrets");
      });
    }
  });

});


app.get('/', (req, res) => {
  res.render('');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Port 3000 has started to listen!');
});
