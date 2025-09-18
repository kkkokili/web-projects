// jshint esversion:8
import {MailChimp_apikey, MailChimp_listID} from "apikey.js";

const express = require('express');

const app = express();

const client = require("@mailchimp/mailchimp_marketing");

app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/NewsLetter.html');
});

app.use(express.static('static'));

app.post('/', (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const country = req.body.country;
  // country without problem
  console.log(country);

  client.setConfig({
    apiKey: MailChimp_apikey,
    server: "us6",
  });

  const run = async () => {
    const response = await client.lists.addListMember(MailChimp_listID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname,
        COUNTRY: country
      }
    });

  };

  run().then(() => res.sendFile(__dirname+'/success.html'))
       .catch(error => {console.log(error.message, error.statusCode);
                        res.sendFile(__dirname+'/failure.html');});

});



app.listen(process.env.PORT || 3000, () => {
  console.log('Port 3000 has started to listen!');
});



// 1. Add member to list:

// const client = require("@mailchimp/mailchimp_marketing");
//
// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });
//
// const run = async () => {
//   const response = await client.lists.addListMember("list_id", {
//     email_address: "Lionel.Lang16@yahoo.com",
//     status: "unsubscribed",
//   });
//   console.log(response);
// };
//
// run();

// Note: If you’re not sure whether or not a contact has already been added to
//  an audience, you should use the Add or update list member endpoint. This will
// create the contact if it doesn’t already exist, or update a contact’s
// information if it does.

// 2. Add or update list member:

// const client = require("@mailchimp/mailchimp_marketing");
//
// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });
//
// const run = async () => {
//   const response = await client.lists.setListMember(
//     "list_id",
//     "subscriber_hash",
//     { email_address: "Sammy_Klein@hotmail.com", status_if_new: "pending" }
//   );
//   console.log(response);
// };
//
// run();
