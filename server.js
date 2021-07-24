require("dotenv").config();
const express = require("express");
const path = require("path");

const port = process.env.PORT || 8000;
const app = express();
const staticDir = process.env.DEV ? "./client/public" : "./client/build";

// Import mongoose and connect to a database
const mongoose = require("mongoose");
mongoose.connect(
  `
mongodb+srv://user:${process.env.PASSWORD}@cluster0.ai7da.mongodb.net/chatroom?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

app.use(express.static(staticDir));
// Wasn't able to access req.body so had to use this line
app.use(express.json());
// Was running into server connection issues. Stackoverflow suggested using these response headers, which seemed to solve the problem.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Expose-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(express.urlencoded({ extended: true }));

// Set schema for messages on the main room. Added roomID as well to make it easier to distinguish between rooms and their specific routes.
const homeMessageSchema = new mongoose.Schema({
  when: Date,
  author: String,
  messageBody: String,
  roomID: String
});

// Create a model using the homeMessageSchema
const HomeMessage = mongoose.model("HomeMessage", homeMessageSchema)


// Post when you submit a message. 
app.post("/rooms/:roomID/messages", async (req, res) => {
//  Grabs the properties from the request body that was created in the fetch in Room.js and assigns them to author and messageBody variables
  let author = req.body.author
  let messageBody = req.body.messageBody
  // Create a new date object and assign it to a variable when
  let when = new Date()
  // Grab the roomID from the url and set it to a variable roomID
  let roomID = req.params.roomID

  // Check if the messageBody is greater than 500 characters in the back end as well in order to prevent malicious requests. Anyone can create messages (of whatever length) without this code block. 
  if(messageBody.length > 500){
    // Status 400 means that there has been an invalid request. Return that to stop the message from being put into the database.
    return res.sendStatus(400);
  }
  
  // Create an instance of the schema and map it with the variables that were just created above
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
