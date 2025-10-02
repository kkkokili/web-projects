// app.js  (ESM)
// jshint esversion:8
import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
const passWord = encodeURIComponent(process.env.passWord || '');

const app = express();

// ----- View & Middlewares -----
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// ----- Mongo Connection (Mongoose 7+) -----
const USER = 'admin-xiaotong';
const PASS = encodeURIComponent(passWord); // 密码含 @/#/! 必须编码
const SRV =
  `mongodb+srv://${USER}:${PASS}` +
  `@cluster0.irgncm5.mongodb.net/todolistDB?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(SRV, {
  writeConcern: { w: 'majority', wtimeoutMS: 2500, journal: true },
});

// ----- Schemas & Models -----
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
});

const paramSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  items: { type: [itemSchema], default: [] }, // 默认空数组，避免校验问题
});

const Task = mongoose.model('Task', itemSchema);
const ParamList = mongoose.model('paramList', paramSchema);

// ----- Date for default list title -----
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
const showDate = new Date().toLocaleDateString('en-US', options);

// ----- Routes -----
app.get('/', async (req, res) => {
  try {
    const items = await Task.find().lean();
    res.render('index', { listTitle: showDate, arraylist: items });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get('/about', (req, res) => res.render('about'));

app.get('/:topic', async (req, res) => {
  const topic = _.startCase(_.toLower(req.params.topic));
  try {
    let doc = await ParamList.findOne({ name: topic }).lean();
    if (!doc) {
      await new ParamList({ name: topic }).save();
      return res.render('index', { listTitle: topic, arraylist: [] });
    }
    res.render('index', { listTitle: doc.name, arraylist: doc.items });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post('/', async (req, res) => {
  const from = req.body.button;
  const newTaskName = (req.body.task || '').trim();
  if (!newTaskName) return res.redirect(from === showDate ? '/' : `/${from}`);

  try {
    const newListItem = await new Task({ name: newTaskName }).save();

    if (from === showDate) return res.redirect('/');

    // 在自定义列表中追加
    await ParamList.updateOne(
      { name: from },
      { $push: { items: newListItem } },
      { upsert: true },
    );
    res.redirect(`/${from}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post('/delete', async (req, res) => {
  const id = req.body.checkbox;
  const from = req.body.listname;

  try {
    if (from === showDate) {
      await Task.findByIdAndDelete(id);
      return res.redirect('/');
    }

    // 从子文档数组中移除
    await ParamList.updateOne(
      { name: from },
      { $pull: { items: { _id: id } } },
    );
    res.redirect(`/${from}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----- Server -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port ${PORT} has started to listen!`));
