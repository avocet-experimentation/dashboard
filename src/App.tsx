import { Route, Switch } from 'wouter';
// import "./assets/stylesheets/App.css";
import Navbar from './components/Navbar';
import './services/FeatureService';
import { Flex } from '@chakra-ui/react';

import Features from './components/features/Features';
import EventFeatures from './components/events/EventFeatures';
import Experiments from './components/experiments/Experiments';
import FeaturePage from './components/features/FeaturePage';
import TopBar from './components/TopBar';
import ExperimentPage from './components/experiments/ExperimentPage';
import EnvironmentsMainPage from './components/environments/EnvironmentsMainPage';

export default function App() {
  return (
    <Flex direction="row" width="100vw" height="100vh" overflow="hidden">
      <Navbar />
      <Flex direction="column" width="calc(100% - 250px)" bg="whitesmoke">
        <TopBar />
        <Switch>
          <Route path="/features" component={() => <Features />} />
          <Route path="/features/:id" component={() => <FeaturePage />} />
          <Route
            path="/environments"
            component={() => <EnvironmentsMainPage />}
          />
          <Route path="/experiments" component={() => <Experiments />} />
          <Route path="/experiments/:id" component={() => <ExperimentPage />} />
          <Route
            path="/events"
            component={() => <EventFeatures></EventFeatures>}
          />
        </Switch>
      </Flex>
    </Flex>
  );
}
