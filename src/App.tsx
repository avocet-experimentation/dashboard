import { Route, Switch } from "wouter";
// import "./assets/stylesheets/App.css";
import Navbar from "./components/Navbar";
import FlagTable from "./components/FlagTable";
import EventTable from "./components/EventTable";
import { Flag, Span } from "./lib/types";
import { useEffect, useState } from "react";
import "./services/FlagService";
import { exampleFlags, exampleSpans } from "./services/exampleData";
import EventService from "./services/EventService";
import { Flex } from "@chakra-ui/react";

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
    };

    fetchData();
  }, []);

  return (
    <Flex direction="row" width="100vw" height="100vh">
      <Navbar />
      <Flex direction="column" width="80%" bg="whitesmoke">
        <Switch>
          <Route
            path="/features"
            component={() => <FlagTable data={flags} />}
          />
          <Route
            path="/events"
            component={() => <EventTable data={events} />}
          />
        </Switch>
      </Flex>
    </Flex>
  );
}
