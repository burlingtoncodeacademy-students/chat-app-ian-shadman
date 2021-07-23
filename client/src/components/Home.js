import "../styles/home.css";

const Home = () => {

  const submitName = () => {
    let userName = document.getElementById("user-name").value
    //Store the username in a cookie
    document.cookie = `userName=${userName}`
    //Redirect the user to the main room 
    document.location = "/room/main"
  }

  return (
    <div className="user-name-wrapper">
      <div className="user-name-card">
        <h1 className="user-title">Create a username:</h1>
        <input className="user-name-input" id="user-name" type="text" name="user" placeholder="Enter your username" />
        <input className="user-name-submit" type="submit" value="Submit" onClick={submitName} />
      </div>


    </div>
  );
};

export default Home