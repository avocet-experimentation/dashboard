import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraUIProvider } from './components/ui/provider';
import App from './App';
import './assets/stylesheets/index.css';
import { ServicesProvider } from './services/ServiceContext';
import { EnvironmentProvider } from './lib/EnvironmentContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ServicesProvider>
      <EnvironmentProvider>
        <ChakraUIProvider>
          <App />
        </ChakraUIProvider>
      </EnvironmentProvider>
    </ServicesProvider>
  </React.StrictMode>,
);
