import { Route, Switch } from 'wouter';
import './assets/stylesheets/App.css';
import Navbar from './components/Navbar';
import FlagTable from './components/FlagTable';
import EventTable from './components/EventTable';

export default function App() {

  return (
    <div className='App'>
      <Navbar />
      <Switch>
        <Route path='/' component={FlagTable} />
        <Route path='/events' component={EventTable} />
      </Switch>
    </div>
  );
}
