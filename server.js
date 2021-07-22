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

const homeMessageSchema = new mongoose.Schema({
  when: Date,
  author: String,
  messageBody: String,
});

const HomeMessage = mongoose.model("HomeMessage", homeMessageSchema)

app.post("/homeMessage", async (req, res) => {
  let author = req.body.author
  let messageBody = req.body.messageBody
  let when = new Date()
  const response = new HomeMessage({
    author: author,
    messageBody: messageBody,
    when: when
  })
  await response.save()
  res.redirect('/')
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
