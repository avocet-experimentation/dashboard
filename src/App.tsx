import { Route, Switch } from "wouter";
// import "./assets/stylesheets/App.css";
import Navbar from "./components/Navbar";
import { FeatureFlag } from "@fflags/types";
import { Span } from "./lib/types";
import { useEffect, useState } from "react";
import "./services/FlagService";
import { exampleFlags, exampleSpans } from "./services/exampleData";
import EventService from "./services/EventService";
import { Flex } from "@chakra-ui/react";

import Features from "./components/Features";
import FeatureTable from "#/components/FeatureTable";
import EventTable from "components/EventTable";
import Experiments from "./components/Experiments";

export default function App() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [events, setEvents] = useState<Span[]>([]);

  const eventService = new EventService();

  useEffect(() => {
    const fetchData = async () => {
      const allFeatures = await fetch("http://localhost:3524/admin/fflags");
      const data = await allFeatures.json();
      setFlags(allFeatures);
    };

    fetchData();
  }, []);

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
    <Flex direction="row" width="100vw" height="100vh" overflow="hidden">
      <Navbar />
      <Flex direction="column" width="80%" bg="whitesmoke">
        <Switch>
          <Route
            path="/features"
            component={() => (
              <Features>
                <FeatureTable data={flags} />
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
