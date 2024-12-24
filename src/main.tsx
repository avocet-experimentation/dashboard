import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraUIProvider } from './components/ui/provider';
import App from './App';
import './assets/stylesheets/index.css';
import { ServicesProvider } from './services/ServiceContext';
import { EnvironmentProvider } from './lib/EnvironmentContext';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/graphql';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ServicesProvider>
        <EnvironmentProvider>
          <ChakraUIProvider>
            <App />
          </ChakraUIProvider>
        </EnvironmentProvider>
      </ServicesProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
