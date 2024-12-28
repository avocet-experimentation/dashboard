import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ServicesProvider } from './services/ServiceContext';
import { EnvironmentProvider } from './lib/EnvironmentContext';
import { Auth0Provider } from '@auth0/auth0-react';
import { system } from "./theme"
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';

const authDomain = import.meta.env.VITE_AUTH0_DOMAIN;
const authClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const authAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ServicesProvider>
      <EnvironmentProvider>
        <ChakraProvider theme={defaultSystem} value={system}>
          <ColorModeProvider>
            <Auth0Provider domain={authDomain} clientId={authClientId}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: authAudience,
            }}
            > 
              <App />
            </Auth0Provider>
          </ColorModeProvider>
        </ChakraProvider>
      </EnvironmentProvider>
    </ServicesProvider>
  </React.StrictMode>,
);
