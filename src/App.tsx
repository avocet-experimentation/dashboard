import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { Route, Switch } from 'wouter';
import Navbar from './components/Navbar';

import FeatureFlagsMain from './components/feature-flags/FeatureFlagsMain';
import ExperimentsMain from './components/experiments/ExperimentsMain';
import FeatureFlagManagementPage from './components/feature-flags/edit-page/FeatureFlagManagementPage';
import ExperimentPage from './components/experiments/edit-page/ExperimentPage';
import EnvironmentsMainPage from './components/environments/EnvironmentsMainPage';
import TelemetryMain from './telemetry/TelemetryMain';

export default function App() {
  return (
      <Grid bg="whitesmoke" templateColumns="300px 1fr" templateRows="1fr" width="100vw" height="100vh" overflow="hidden">
        <GridItem display="flex"  flexDir="row" justifyContent="center">
          <Navbar />
        </GridItem>
        <GridItem>
          <Switch>
            <Route path="/features" component={FeatureFlagsMain} />
            <Route path="/features/:id" component={FeatureFlagManagementPage} />
            <Route path="/environments" component={EnvironmentsMainPage} />
            <Route path="/experiments" component={ExperimentsMain} />
            <Route path="/experiments/:id" component={ExperimentPage} />
            <Route path="/telemetry" component={TelemetryMain} />
          </Switch>
        </GridItem>
      </Grid>
  );
}
