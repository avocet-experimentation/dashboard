import { Route, Switch } from 'wouter';
import './assets/stylesheets/App.css';
import Navbar from './components/Navbar';
import FlagTable from './components/FlagTable';
import EventTable from './components/EventTable';
import { Flag, Span } from './lib/types';
import { useEffect, useState } from 'react';
import './services/FlagService';
import { exampleFlags, exampleSpans } from './services/exampleData';
import EventService from './services/EventService';

export default function App() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [events, setEvents] = useState<Span[]>([]);

  const eventService = new EventService();

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await eventService.getAllEvents();
      setFlags(exampleFlags);
      if (allEvents) {
        setEvents(allEvents);
      }
    }

    fetchData();
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
