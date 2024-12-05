import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraUIProvider } from './components/ui/provider';
import App from './App';
import './assets/stylesheets/index.css';
import { ServicesProvider } from './services/ServiceContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ServicesProvider>
      <ChakraUIProvider>
        <App />
      </ChakraUIProvider>
    </ServicesProvider>
  </React.StrictMode>,
);
