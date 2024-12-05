import { Flex } from '@chakra-ui/react';
import { Route, Switch } from 'wouter';
// import "./assets/stylesheets/App.css";
import Navbar from './components/Navbar';

import FeatureFlagsMain from './components/features/FeatureFlagsMain';
import EventFeatures from './components/events/EventFeatures';
import ExperimentsMain from './components/experiments/ExperimentsMain';
import FeatureFlagManagementPage from './components/features/FeatureFlagManagementPage';
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
          <Route path="/features" component={FeatureFlagsMain} />
          <Route
            path="/features/:id"
            component={(id) => <FeatureFlagManagementPage flagId={id} />}
          />
          <Route path="/environments" component={EnvironmentsMainPage} />
          <Route path="/experiments" component={ExperimentsMain} />
          <Route path="/experiments/:id" component={() => <ExperimentPage />} />
          <Route path="/events" component={EventFeatures} />
        </Switch>
      </Flex>
    </Flex>
  );
}
