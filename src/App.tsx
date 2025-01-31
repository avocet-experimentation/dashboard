import { Grid, GridItem } from '@chakra-ui/react';
import { Route, Switch } from 'wouter';
import Navbar from './components/Navbar';

import FeatureFlagsMain from './components/feature-flags/FeatureFlagsMain';
import ExperimentsMain from './components/experiments/ExperimentsMain';
import FeatureFlagManagementPage from './components/feature-flags/edit-page/FeatureFlagManagementPage';
import ExperimentManagementPage from './components/experiments/edit-page/ExperimentManagementPage';
import EnvironmentsMainPage from './components/environments/EnvironmentsMainPage';
import TelemetryMain from './components/telemetry/TelemetryMain';
import SDKConnectionsMain from './components/sdk-connections/SDKConnectionsMain';
import { Toaster } from './components/ui/toaster';
import LoginPage from './components/LoginPage';
import AuthLoader from './AuthLoader';
import UserProfile from './components/UserProfilePage';
import { useAuth } from './lib/UseAuth';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log(isAuthenticated);

  if (isLoading) return <AuthLoader message="Checking credentials..." />;

  if (!isAuthenticated) return <LoginPage />;

  return (
    <Grid
      bg="avocet-bg"
      color="avocet-text"
      templateColumns="300px 1fr"
      templateRows="1fr"
      width="100vw"
      height="100vh"
      overflow="hidden"
    >
      <GridItem display="flex" flexDir="row" justifyContent="center">
        <Navbar />
      </GridItem>
      <GridItem>
        <Switch>
          <Route path="/profile" component={UserProfile} />
          <Route path="/feature-flags" component={FeatureFlagsMain} />
          <Route
            path="/feature-flags/:id"
            component={FeatureFlagManagementPage}
          />
          <Route path="/environments" component={EnvironmentsMainPage} />
          <Route path="/experiments" component={ExperimentsMain} />
          <Route path="/experiments/:id" component={ExperimentManagementPage} />
          <Route path="/telemetry" component={TelemetryMain} />
          <Route path="/connections" component={SDKConnectionsMain} />
        </Switch>
      </GridItem>
      <Toaster />
    </Grid>
  );
}
