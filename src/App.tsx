import { Route, Switch } from "wouter";
// import "./assets/stylesheets/App.css";
import Navbar from "./components/Navbar";
import { Span } from "./lib/types";
import { useState } from "react";
import "./services/FeatureService";
import EventService from "./services/EventService";
import { Flex } from "@chakra-ui/react";

import Features from "./components/features/Features";
import EventTable from "./components/EventTable";
import Experiments from "./components/experiments/Experiments";
import FeaturePage from "./components/features/FeaturePage";
import TopBar from "./components/TopBar";

export default function App() {
  const [events, setEvents] = useState<Span[]>([]);

  const eventService = new EventService();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const allEvents = await eventService.getAllEvents();
  //     if (allEvents) {
  //       setEvents(allEvents);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Flex direction="row" width="100vw" height="100vh" overflow="hidden">
      <Navbar />
      <Flex direction="column" width="calc(100% - 250px)" bg="whitesmoke">
        <TopBar />
        <Switch>
          <Route path="/features" component={() => <Features />} />
          <Route path="/features/:id" component={() => <FeaturePage />} />
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
