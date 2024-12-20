import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraUIProvider } from './components/ui/provider';
import App from './App';
// import './assets/stylesheets/index.css';
import { ServicesProvider } from './services/ServiceContext';
import { EnvironmentProvider } from './lib/EnvironmentContext';
import { Auth0Provider } from '@auth0/auth0-react';

const authDomain = import.meta.env.AUTH0_DOMAIN; // currently returning undefined
const authClientId = import.meta.env.AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ServicesProvider>
      <EnvironmentProvider>
        <ChakraUIProvider>
          <Auth0Provider domain={authDomain} clientId={authClientId} authorizationParams={{ redirect_uri: window.location.origin }}>
            <App />
          </Auth0Provider>
        </ChakraUIProvider>
      </EnvironmentProvider>
    </ServicesProvider>
  </React.StrictMode>,
);
