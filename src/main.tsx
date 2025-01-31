import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { system } from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AuthProvider } from './lib/UseAuth';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const key = mutation.options.mutationKey;
      if (!key) return;
      console.warn(`Invalidating key ${key}`);
      queryClient.invalidateQueries({
        queryKey: key,
      });
    },
  }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
