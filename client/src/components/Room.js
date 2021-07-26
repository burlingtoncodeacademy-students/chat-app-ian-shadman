import { useState, useEffect, useRef } from "react";
import "../styles/room.css";
import React from "react";

const Room = () => {
  // State hooks for setting messages, user, totalMessages, and a sendError variable
  const [messages, setMessages] = useState("");
  const [user, setUser] = useState("");
  const [totalMessages, setTotalMessages] = useState(0);
  const [sendError, setSendError] = useState();

  // allows div to be targeted based on their ref property
  const messagesRef = useRef(null);
  // scrollToBottom function scrolls to the bottom of the messages whenever a new message is added
  function scrollToBottom() {
    // scrolls to div with ref=messagesRef. behavior: instant snaps to bottom when new message is added.
    messagesRef.current.scrollIntoView({ behavior: "instant" });
  }
  // useEffect occurs when totalMessages changes
  useEffect(() => {
    // Every time totalMessages is updated, call the scrolltobottom function
    scrollToBottom();
  }, [totalMessages]);

  //Because slice returns an array, we need to take the first element
  const roomID = window.location.href.split("/").slice(-1)[0];

  async function submitMessage(evt) {
    // Grab the value of the text entered into messageBody using a dom query
    const messageBody = document.getElementById("messageContent").value;
    // Before checking the length of the message, reset the sendError to be empty. This way, the error message will disappear after a shortened message is sent.
    setSendError();
    // If the length of the message is greater than 500 characters, set the sendError state variable to hold an error message string. Return after that so that we don't create another fetch request and the database is not updated.
    if (messageBody.length > 500) {
      setSendError("Maximum characters is 500. Please shorten your message.");
      return;
    }
    //Make a post request to the "messages" endpoint.
    await fetch(`http://localhost:8000/rooms/${roomID}/messages`, {
      method: "POST",
      //Send the username and message content
      //JSON.stringify converts the body object into a string(Body object contains the user data we want to send to the server)
      body: JSON.stringify({
        author: user,
        messageBody: messageBody,
      }),
      //content type header tells the express server the format that the data is in
      headers: {
        "content-type": "application/json",
      },
    });
    // remove the text content from the input field after submitting message
    document.getElementById("messageContent").value = "";
    //Load the messages after a new message has been sent
    getMessages();
  }

  function getMessages() {
    //Fetch all the messages from the server and store it in the messages state variable.
    fetch(`http://localhost:8000/rooms/${roomID}/messages`)
      .then((res) => res.json())
      .then((res) => {
        setMessages(res);
        // If the length of the message response from the fetch request is greater than the value of totalMessages(which is initialized to 0), it means a message has been sent. Update totalMessages to be that same value.
        if (res.length !== totalMessages) {
          setTotalMessages(res.length);
        }
      });
  }
  // This function is called when the "Enter" key is pressed.
  let enterPressed = (evt) => {
    if (evt.key === "Enter") {
      // When the key is pressed, submit the message
      submitMessage();
    }
  };
  useEffect(() => {
    //Get the username from the cookie and set the user state variable. Split the cookie string by "=" since it holds key value pairs. Grab the second element from the array.
    setUser(document.cookie.split("=")[1]);
    //Run the get messages function in order to load in all the messages
    getMessages();

    //Reload all messages every half a second using setInterval
    setInterval(() => {
      getMessages();
    }, 500);
  }, []);

  return (
    <div>
      <h1 className="home-header">
        <a className="header-link" href="/">
          Chat App
        </a>
      </h1>

      <div className="container">
        <div className="messages-wrapper">
          {/* Greetings header that displays the value of the user state variable */}
          <h1 className="greeting">Hello {user}</h1>
          <div className="messages-rooms-wrapper">
            <div className="messages">
              {/* Represents the title of each chat in the main chat box. Because it uses room ID to display those titles and room ID is lowercase, must use charAt to grab the first letter of each title, capitalize it and then combine it with everything after the first letter. */}
              <h3 className="chat-title">
                {roomID.charAt(0).toUpperCase()}
                {roomID.substring(1)} Chat
              </h3>
              <div>
                {messages ? (
                  //If messages is defined, loop through it and display various elements. Messages refers to an array of message objects. Message refers to the individual message object itself(which holds author, messageBody, roomID etc.)
                  messages.map((message, index) => (
                    <div key={index}>
                      <p>
                        {/* Display the author of the message along with the message itself using the properties of the message object. Put the author of the message, aka username into a strong to make it bold. */}
                        <strong>{message.author}</strong>: {message.messageBody}
                      </p>

                      <p className="message-date">
                        Created on: {new Date(message.when).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  // If messages is undefined, just create an empty p tag.
                  <p></p>
                )}
                {/* div that scrollToBottom scrolls to when messages is updated. this div is below messages so it always scrolls to the newest message at the bottom */}
                <div ref={messagesRef} />
              </div>
            </div>

            <div className="rooms">
              {/* Represents the header at the top of the rooms nav bar. */}
              <h3 className="room-title">Rooms</h3>

              {/* If the current room ID is equal to a certain room title, it means we are currently in that room. Give the element a class of highlight in order to have it stay highligted when selected. Otherwise, just add a class of an empty string. */}
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
            {/* Represents the textbox for the message. */}
            <textarea
              id="messageContent"
              type="textarea"
              name="messageBody"
              placeholder="What would you like to say?"
              //Check when a key is pressed with onKeyPress. Filter which key to watch for using the enterPressed function.
              onKeyPress={enterPressed}
            />
            {/* Submit button which runs the submitMessage function when clicked */}
            <button
              className="control-button"
              onClick={submitMessage}
              value="send"
            >
              Submit
            </button>
            {/* Refresh button which refreshes the messages by running the getMessages function when clicked */}
            <button
              className="control-button"
              onClick={getMessages}
              value="refresh"
            >
              Refresh
            </button>
          </div>

          {/*If the sendError state variable is defined, display it to the user using a p tag  */}
          {sendError && <p className="error-msg">{sendError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Room;
