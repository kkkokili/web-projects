//jshint esversion:6

// ------------IMPORT ALL THE USEFUL MODULES SATRT------------------------------
require('dotenv').config();

const express = require("express");

const ejs = require("ejs");

const mongoose = require("mongoose");

const _ =require("lodash");

const encrypt =require("mongoose-encryption");
// encrypter (AES 256 with CBC)

// ------------IMPORT ALL THE USEFUL MODULES END--------------------------------

// ---------------------Server Setup Template START-----------------------------

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// ---------------------Server Setup Template END-----------------------------

// -----------------------------MONGOOSE START---------------------------------

mongoose.connect(`mongodb://localhost:27017/userDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('user', userSchema);

// ------------------------------MONGOOSE END-----------------------------------

app.get('/', (req, res) =>{
  res.render('home');
});

app.get('/login', (req, res) =>{
  res.render('login');
});

app.post('/login', (req, res) => {
  User.findOne({email: req.body.username}, (err, result) => {
    if (err) {
      res.send(err);
    } else if (result) {
      if (result.password == req.body.password) {
        res.render('secrets');
      } else {
        res.send('Your Password is not correct!');
      }
    } else {
      res.send('No Email Found!');
    }
  });
});


app.get('/register', (req, res) =>{
  res.render('register');
});

app.post('/register', (req, res) => {
  const newuser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newuser.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.render('secrets');
    }
  });
});


app.get('/', (req, res) =>{
  res.render('');
});

app.listen(3000, () => {
  console.log('Port 3000 has started to listen!');
});
