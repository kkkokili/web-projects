// This File is used to test API setup correctly, it should be run in node terminal
// because the require function only be used in Node.js, it cannot be opened with browser
// jshint esversion: 8
//
import {MailChimp_apikey, MailChimp_listID} from "apikey.js";

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: MailChimp_apikey,
  server: "us6",
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();
