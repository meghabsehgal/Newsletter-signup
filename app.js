//jshint esversion:6
//const { json } = require("express");
//const express = require("express");
import express from "express";
import request from "request";
import https from "https";

import dotenv from "dotenv";
dotenv.config({ path: "vars/.env" });
const MAPI_KEY = process.env.API_KEY;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;

import mailchimp from "@mailchimp/mailchimp_marketing"; //npm install @mailchimp/mailchimp_marketing

import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});


app.post("/", function (req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  // const subscribingUser = {
  //   firstName: firstName,
  //   lastName: lastName,
  //   email: email,
  // };

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url =
    "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;

  const options = {
    method: "POST",
    auth: "namu:" + MAPI_KEY,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

//   async function run() {
//     const response = await mailchimp.lists
//       .addListMember(listId, {
//         email_address: subscribingUser.email,
//         status: "subscribed",
//         merge_fields: {
//           FNAME: subscribingUser.firstName,
//           LNAME: subscribingUser.lastName,
//         },
//       })
//       .then(
//         (value) => {
//           console.log("Successfully added contact as an audience member.");
//           res.sendFile(__dirname + "/public/success.html");
//         },
//         (reason) => {
//           res.sendFile(__dirname + "/public/failure.html");
//         }
//       );
//   }

//   run();

//   console.log(firstName, lastName, email);
// });

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server is running on port ", port);
});
