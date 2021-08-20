import "../styles/home.css";

const Home = () => {
  const submitName = () => {
    // set userName to user input from input with id "user-name"
    let userName = document.getElementById("user-name").value;
    //Store the username in a cookie
    document.cookie = `userName=${userName}`;
    //Redirect the user to the main room
    document.location = "/room/main";
  };

  return (
    <div>
      <h1 className="home-header">Chat App</h1>
      {/* takes up entire page. contains username card, header, and inputs */}
      <div className="user-name-wrapper">
        {/* smaller div containing header and inputs for user to create a username */}
        <div className="user-name-card">
          <h1 className="user-title">Create a username:</h1>
          <input
            className="user-name-input"
            id="user-name"
            type="text"
            name="user"
            placeholder="Enter your username"
          />
          <input
            className="user-name-submit"
            type="submit"
            value="Submit"
            // call submit function onclick
            onClick={submitName}
          />
        </div>
      </div>
    </div>
  );
};
// exports Home function
export default Home;
