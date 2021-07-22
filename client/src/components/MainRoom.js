import { useState, useEffect } from "react";
const MainRoom = () => {
  const [messages, setMessages] = useState("");
  const [user, setUser] = useState("");

  function submitMessage(evt) {
      fetch('/messageColl')
        .then((res) => res.json())
        .then((userObj) => {
            setMessages(userObj.messageBody)
        })
      
  }
  let authorName = window.location.pathname.split("/").splice(-1)
  useEffect(() => {
    if (!user) {
      setUser(authorName);
      fetch("/username/" + authorName)
        .then((res) => res.json())
        .then((author) => {
          console.log(author);
        });
    }
  });


  console.log(authorName)
  return (
    <div>
      <h1>Hello {user}</h1>
      <div className="display-container">
        <div className="display">
            {messages ? (
                messages.map((message, index) => (
                    <div key={index}>
                        <p>{authorName}: {message}</p>
                    </div>
                ))
            ) : (
                <p></p>
            )}
        </div>
      </div>
      <form action="/mainMessage/:user" method="POST" onSubmit={submitMessage}>
        <input
          type="text"
          name="messageBody"
          placeholder="What would you like to say?"
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
};

export default MainRoom;
