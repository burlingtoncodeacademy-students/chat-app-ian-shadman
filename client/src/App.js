import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import MainRoom from './components/MainRoom.js'
import Room from './components/Room.js'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/mainMessage/:user' component={MainRoom} />
        <Route path='/room/:roomId' component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
