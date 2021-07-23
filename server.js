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

// mongoose.connect(
//   `mongodb://localhost:27017/test`,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

app.use(express.static(staticDir));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Expose-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(express.urlencoded({ extended: true }));
// set schema for messages on the main room
const homeMessageSchema = new mongoose.Schema({
  when: Date,
  author: String,
  messageBody: String,
  roomID: String
});

const HomeMessage = mongoose.model("HomeMessage", homeMessageSchema)


// post when you submit a message
app.post("/rooms/:roomID/messages", async (req, res) => {
 
  let author = req.body.author
  let messageBody = req.body.messageBody
  let when = new Date()
  let roomID = req.params.roomID
  
  const response = new HomeMessage({
    author: author,
    messageBody: messageBody,
    when: when,
    roomID: roomID
  })
  await response.save()
  //Send the 204 status which means that the request succeeded but has nothing to send back. This way, we don't have to refresh the page in order to see the updated messages.
  res.sendStatus(204)

});

//Get all the messages in a room
app.get("/rooms/:roomID/messages", async (req, res) => {
  let messages = await HomeMessage.find({roomID:req.params.roomID})
  //Messages is a mongoose array which holds metadata about the changes to the array. Must be converted into a plain JavaScript array.
  res.send(messages)
})

app.listen(port, () => {
  console.log("listening on port: " + port);
});
