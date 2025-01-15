import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { system } from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

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
const authDomain = import.meta.env.VITE_AUTH0_DOMAIN;
const authClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const authAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <Auth0Provider
            domain={authDomain}
            clientId={authClientId}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: authAudience,
            }}
          >
            <App />
          </Auth0Provider>
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
