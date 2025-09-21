    // Finished Version

    // jshint esversion:8
    import {passWord} from "./password.mjs";

    import express from 'express';

    import mongoose from 'mongoose';

    // intsall lodash >>> npm i --save lodash
    // if jump out "npm ERR! code ENOENT" >>npm cahce clean --force / npm cache verify /npm i

    import _ from 'lodash';

    const app = express();

    app.set('view engine', 'ejs');

    // parse req.body
    app.use(express.urlencoded({
      extended: true
    }));

    // -----------MONGOOSE--------------------

    mongoose.connect(`mongodb+srv://admin-xiaotong:${passWord}@cluster0.k4lze.mongodb.net/todolistDB`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const itemSchema = new mongoose.Schema({
      name: String,
    });

    // 或者 这样declare a schema
    // const itemSchema = {
    //   name: String
    // };

    const task = mongoose.model('Task', itemSchema);

    // Create a new collection to store different urlInput and their list items
    const paramSchema = {
      name: String,
      items: [itemSchema]
    };

    const paramlist = mongoose.model('paramList', paramSchema);

    // --------------MONGOOSE---------------------------------------

    // task.deleteMany({}, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(result);
    //   }
    // });

    // ----------Declare Global Variables------------------------------------------------------

    var newTask;

    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    var today = new Date();
    var showDate = today.toLocaleDateString("en-US", options);

    // ----------Declare Global Variables-----------------------------------------------------------

    app.use(express.static('static'));


    app.get('/', (req, res) => {
      task.find((err, items) => {
        if (err) {
          console.log(err);
        } else {
          res.render('index', {
            listTitle: showDate,
            arraylist: items
          });
        }
      });
    });


    app.get('/about', (req, res) => {
      res.render('about');
    });


    app.get('/:topic', (req, res) => {
      const topic = _.startCase(_.toLower(req.params.topic));
      // _.startCase(_.toLower(str)); 首字母大写
      // _.lowerCase(req.params.topic); 去掉各种符号+小写

      paramlist.findOne({
        name: topic
      }, (err, findResult) => {
        if (err) {
          console.log(err);
        } else {
          // if there is no findresult
          if (!findResult) {
            const newTopic = new paramlist({
              name: topic
            });
            // 我本来写了下面这行代码 但是报错说validation有问题，然后我把它隐掉了就好了
            // 应该是因为items 设置了line 37的限制，所以不能传empty array
            // items: []

            newTopic.save()
              .then(() => {
                res.render('index', {
                  listTitle: topic,
                  arraylist: []
                });
              }).catch(err => console.log(err));
          } else {

            res.render('index', {
              listTitle: findResult.name,
              arraylist: findResult.items
            });
          }
        }
      });

    });


    app.post('/', (req, res) => {
      const from = req.body.button;
      newTask = req.body.task;
      const newListItem = new task({
        name: newTask
      });

      if (from == showDate) {
        newListItem.save().then(() => {
          res.redirect("/");
        });
      } else {
        paramlist.findOne({
          name: from
        }, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            results.items.push(newListItem);
            results.save().then(() => {
              res.redirect("/" + from);
            });
          }

        });
      }
    });


    app.post('/delete', (req, res) => {
      const checkedItem = req.body.checkbox;
      const from = req.body.listname;
      if (from == showDate) {
        task.findByIdAndRemove(checkedItem, (err) => {
          if (err) {
            console.log('Cant remove the checkedItem, because the item id has problem');
          } else {
            console.log('remove item by id success!');
            res.redirect('/');
          }
        });
      } else {
        paramlist.findOne({
          name: from
        }, (err, findResult) => {
          if (err) {
            console.log(err);
          } else {
            console.log(findResult);
            findResult.items.id(checkedItem).remove();
            findResult.save().then(() => {
              res.redirect("/" + from);
            });
          }
        });
      }
    });


    app.listen(process.env.PORT || 3000, () => {
      console.log('Port 3000 has started to listen!');
    });
