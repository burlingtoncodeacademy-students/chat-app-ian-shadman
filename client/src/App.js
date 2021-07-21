import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home.js'
import Room from './components/Room.js'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Home} />
        <Route path='/room/:roomId' component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
