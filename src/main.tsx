import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraUIProvider } from './components/ui/provider';
import App from './App';
// import './assets/stylesheets/index.css';
import { ServicesProvider } from './services/ServiceContext';
import { EnvironmentProvider } from './lib/EnvironmentContext';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      console.warn(`Invalidating key ${mutation.options.mutationKey}`);
      queryClient.invalidateQueries({
        queryKey: mutation.options.mutationKey,
      });
    },
  }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraUIProvider>
        <App />
      </ChakraUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
