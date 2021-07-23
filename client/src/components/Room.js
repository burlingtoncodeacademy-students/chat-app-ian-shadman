import { useState, useEffect, useRef } from "react";
import "../styles/room.css";
import React from "react";

const Room = () => {
  const [messages, setMessages] = useState("");
  const [user, setUser] = useState("");

  // allows div to be targeted based on their ref property
  const messagesRef = useRef(null)
  // scrollToBottom function scrolls to the bottom of the messages whenever a new message is added
  function scrollToBottom() {
    // scrolls to div with ref=messagesRef. behavior: instant snaps to bottom when new message is added.
    messagesRef.current.scrollIntoView({ behavior: "instant" })
  }
  // useEffect occurs when messages changes
  useEffect(() => {
    // calls scrolltobottom function
    scrollToBottom()
  }, [messages])

  //Because slice returns an array, we need to take the first element
  const roomID = window.location.href.split("/").slice(-1)[0];

  async function submitMessage(evt) {
    console.log(roomID);
    //Make a post request to the "messages" endpoint.
    await fetch(`http://localhost:8000/rooms/${roomID}/messages`, {
      method: "POST",
      //Send the username and message content
      //JSON.stringify converts the body object into a string(Body object contains the user data we want to send to the server)
      body: JSON.stringify({
        author: user,
        messageBody: document.getElementById("messageContent").value,
      }),
      //content type header tells the express server the format that the data is in
      headers: {
        "content-type": "application/json",
      },
    });
    // remove the text content from the input field after submitting message
    document.getElementById("messageContent").value = ""
    //Load the messages after a new message has been sent
    getMessages();
  }

  function getMessages() {
    //Fetch all the messages from the server and store it in the messages state variable
    fetch(`http://localhost:8000/rooms/${roomID}/messages`)
      .then((res) => res.json())
      .then((res) => {
        setMessages(res);
      });
  }

  useEffect(() => {
    //Get the username from the cookie and set the user state variable. Split the cookie string by "=" since it holds key value pairs. Grab the second element from the array.
    setUser(document.cookie.split("=")[1]);
    //Run the get messages function in order to load in all the messages
    getMessages();

    //Reload all messages every 10 seconds
    setInterval(() => {
      getMessages();
    }, 10000);
  }, []);

  return (
    <div>
      <h1 className="home-header"><a className="header-link" href="/">Chat App</a></h1>

      <div className="container">
        
        <div className="messages-wrapper">
          <h1 className="greeting">Hello {user}</h1>
          <div className="messages-rooms-wrapper">
            <div className="messages">
              <h3 className="chat-title">
                {roomID.charAt(0).toUpperCase()}
                {roomID.substring(1)} Chat
              </h3>
              <div>
              {messages ? (
                //Messages refers to an array of message objects. Message refers to the individual message object itself(which holds author, messageBody, roomID etc.)
                messages.map((message, index) => (
                  <div key={index}>
                    <p>
                      <strong>{message.author}</strong>: {message.messageBody}
                    </p>
                    <p>Created on: {new Date(message.when).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p></p>
              )}
              {/* div that scrollToBottom scrolls to when messages is updated. this div is below messages so it always scrolls to the newest message at the bottom */}
              <div ref={messagesRef} />
              </div>
            </div>

            <div className="rooms">
              <h3 className="room-title">Rooms</h3>
              <a
                className={roomID === "main" ? "highlight" : ""}
                href="/room/main"
              >
                Main
              </a>
              <a
                className={roomID === "sports" ? "highlight" : ""}
                href="/room/sports"
              >
                Sports
              </a>
              <a
                className={roomID === "programming" ? "highlight" : ""}
                href="/room/programming"
              >
                Programming
              </a>
            </div>
          </div>
          <div className="controls">
          <input
            id="messageContent"
            type="text"
            name="messageBody"
            placeholder="What would you like to say?"
          />
          <button className="control-button" onClick={submitMessage} value="send">
            Submit
          </button>
          <button className="control-button" onClick={getMessages} value="refresh">
            Refresh
          </button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default Room;
