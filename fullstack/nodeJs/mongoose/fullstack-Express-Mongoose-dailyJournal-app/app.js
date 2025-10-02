// jshint esversion:6

console.log('>>> CWD:', process.cwd());
console.log(
  '>>> ENTRY FILE:',
  import.meta && import.meta.url ? import.meta.url : __filename,
);
console.log('>>> NODE VERSION:', process.version);
// --------------- imports --------------------
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import _ from 'lodash';

// --- Express app & middlewares ---
const app = express();

app.set('view engine', 'ejs'); // 使用 EJS
app.use(express.urlencoded({ extended: true })); // 解析表单 req.body
app.use(express.static('public'));

// 兼容你现在 Render 只有 passWord 的情况；也支持 MONGO_* 四件套
const legacySrv = (process.env.MONGO_URI || '').trim();
const useSrvFromEnv = legacySrv.startsWith('mongodb+srv://');

const USER = process.env.MONGO_USER || 'admin-xiaotong';
const PASS = encodeURIComponent(
  process.env.MONGO_PASS || process.env.passWord || '6YOxqvjbVCNXilyM',
);
const DB = process.env.MONGO_DB || 'dailyJournalDB'; // ← dailyJournal 用自己的库名
const APP = process.env.MONGO_APPNAME || 'Cluster0';

const SRV = useSrvFromEnv
  ? legacySrv
  : `mongodb+srv://${USER}:${PASS}@cluster0.irgncm5.mongodb.net/${DB}?retryWrites=true&w=majority&appName=${APP}`;

console.log('[DB] uses +srv:', SRV.startsWith('mongodb+srv://')); // 只打印前缀，不泄密

try {
  await mongoose.connect(SRV);
  console.log('[DB] connected');
} catch (e) {
  console.error('[DB] connect failed:', {
    name: e.name,
    code: e.code,
    codeName: e.codeName ?? e.reason?.codeName,
    message: e.message,
  });
  process.exit(1); // 直接失败，避免“卡住”
}

// 运行期错误也打出来
mongoose.connection.on('error', (err) => {
  console.error('[DB] runtime error:', err);
});

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
