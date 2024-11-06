import { Route, Switch } from "wouter";
// import "./assets/stylesheets/App.css";
import Navbar from "./components/Navbar";
import { FeatureFlag } from "@fflags/types";
import { Span } from "./lib/types";
import { useEffect, useState } from "react";
import "./services/FeatureService";
import { exampleFlags, exampleSpans } from "./services/exampleData";
import EventService from "./services/EventService";
import { Flex } from "@chakra-ui/react";

import Features from "./components/features/Features";
import FeatureTable from "./components/features/FeatureTable";
import EventTable from "./components/EventTable";
import Experiments from "./components/experiments/Experiments";

export default function App() {
  const [events, setEvents] = useState<Span[]>([]);

  const eventService = new EventService();

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await eventService.getAllEvents();
      if (allEvents) {
        setEvents(allEvents);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex direction="row" width="100vw" height="100vh" overflow="hidden">
      <Navbar />
      <Flex direction="column" width="80%" bg="whitesmoke">
        <Switch>
          <Route
            path="/features"
            component={() => (
              <Features>
                <FeatureTable />
              </Features>
            )}
          />
          <Route path="/experiments" component={() => <Experiments />} />
          <Route
            path="/events"
            component={() => <EventTable data={events} />}
          />
        </Switch>
      </Flex>
    </Flex>
  );
}
