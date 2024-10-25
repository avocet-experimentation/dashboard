import { Route, Switch } from 'wouter';
import './assets/stylesheets/App.css';
import Navbar from './components/Navbar';
import FlagTable from './components/FlagTable';
import EventTable from './components/EventTable';
import { Flag, Span } from './types';
import { useEffect, useState } from 'react';
import { exampleFlags, exampleSpans } from './exampleData';

export default function App() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [events, setEvents] = useState<Span[]>([]);

  useEffect(function fetchData() {
    setFlags(exampleFlags);
    setEvents(exampleSpans);
  }, []);

  return (
    <div className='App'>
      <Navbar />
      <Switch>
        <Route path='/' component={() => <FlagTable data={flags} />} />
        <Route path='/events' component={() => <EventTable data={events} />} />
      </Switch>
    </div>
  );
}
