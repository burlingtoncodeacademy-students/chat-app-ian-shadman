const Home = () => {
  return (
    <div>
      <form action="/login" method="POST">
        <input type="text" name="user" placeholder="Enter your username" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home