require("dotenv").config();
const express = require("express");
const path = require("path");

const port = process.env.PORT || 8000;
const app = express();
const staticDir = process.env.DEV ? "./client/public" : "./client/build";

const mongoose = require("mongoose");
mongoose.connect(
  `
mongodb+srv://user:${process.env.PASSWORD}@cluster0.ai7da.mongodb.net/chatroom?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

app.use(express.static(staticDir));
app.use(express.urlencoded({ extended: true }));
// set schema for messages on the main room
const homeMessageSchema = new mongoose.Schema({
  when: Date,
  author: String,
  messageBody: String,
});

const HomeMessage = mongoose.model("HomeMessage", homeMessageSchema)
//takes the username from the login and attaches it to the url
app.post("/login", (req, res) => {
  let userName = req.body.user
  res.redirect(`/mainMessage/${userName}`)
})
// initialize authorObj
let authorObj;
// set authorObj to the user param in the url
app.get("/username/:user", async (req, res) => {
  authorObj = req.params.user
})

// post when you submit a message
app.post("/mainMessage/:user", async (req, res) => {
  // sets author to the authorObj assigned above
  let author = authorObj
  let messageBody = req.body.messageBody
  let when = new Date()
  const response = new HomeMessage({
    author: author,
    messageBody: messageBody,
    when: when
  })
  await response.save()
  res.redirect('/mainMessage/:user')
});

app.get("/messageColl", (req, res) => {
  
})

app.listen(port, () => {
  console.log("listening on port: " + port);
});
