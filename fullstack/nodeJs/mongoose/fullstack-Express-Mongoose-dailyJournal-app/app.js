// jshint esversion:6

// --------------- imports --------------------
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import _ from 'lodash';

// --------------- app setup ------------------
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --------------- MongoDB --------------------
// 兼容你现有的 passWord；也支持更标准的 MONGO_* 命名。
const USER = process.env.MONGO_USER || 'admin-xiaotong';
const RAW_PASS = process.env.MONGO_PASS || process.env.passWord || '';
const HOST = process.env.MONGO_HOST || 'cluster0.irgncm5.mongodb.net';
const DBNAME = process.env.MONGO_DB || 'JournalDB';

const PASS = encodeURIComponent(RAW_PASS);
const SRV = `mongodb+srv://${USER}:${PASS}@${HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

async function connectDB() {
  try {
    await mongoose.connect(SRV, { dbName: DBNAME }); // ✅ Mongoose v6+ 不需要老选项
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo connect error:', e);
    process.exit(1); // 让 Render 重新拉起，避免挂死
  }
}
connectDB();

// schema + model
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    post: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Compose = mongoose.model('Compose', itemSchema);

// --------------- routes ---------------------
const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam...';

const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...';

const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices...';

app.get('/', async (req, res) => {
  try {
    const items = await Compose.find().sort({ createdAt: -1 }).lean();
    res.render('home', {
      homeTitle: 'Home',
      homePost: homeStartingContent,
      postList: items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/about', (req, res) => {
  res.render('about', { about: aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { contact: contactContent });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

// 用标题作为路由参数，注意做好空结果处理
app.get('/posts/:topic', async (req, res) => {
  try {
    const urlInput = req.params.topic;
    const result = await Compose.findOne({ title: urlInput }).lean();
    if (!result) {
      // 你也可以渲染一个 404.ejs
      return res.status(404).send('Post not found');
    }
    res.render('post', {
      postTitle: result.title,
      postID: result._id,
      postContent: result.post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/compose', async (req, res) => {
  try {
    const { title, post } = req.body;
    await Compose.create({ title, post });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/delete', async (req, res) => {
  try {
    const deleteID = req.body.deleteID;
    await Compose.findByIdAndDelete(deleteID);
    console.log('Removed item by ID successfully!');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// --------------- server ---------------------
const PORT = Number(process.env.PORT) || 3000; // ✅ Render 注入 PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
