import { createContext, useContext, useState } from 'react';
import {
  Auth0Client,
  createAuth0Client,
  GetTokenSilentlyOptions,
} from '@auth0/auth0-spa-js';
import { useAuth0, User } from '@auth0/auth0-react';

export const auth0Client = await createAuth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
});

type AuthContextValue = Omit<
  ReturnType<typeof useAuth0>,
  | 'getAccessTokenSilently'
  | 'getAccessTokenWithPopup'
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'handleRedirectCallback'
> & {
  getAccessTokenSilently: (
    options?: GetTokenSilentlyOptions,
  ) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error(
      'Context was not initialized. ' +
        'This likely happened because it was accessed outside of its provider.',
    );
  }

  return auth;
};

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error>();
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  // const [popupOpen, setPopupOpen] = useState(false);

  const getAccessTokenSilently = async (
    options?: GetTokenSilentlyOptions,
  ): Promise<string> => auth0Client.getTokenSilently();
  const logout = async () => {
    try {
      setIsLoading(true);
      await auth0Client.logout();
    } finally {
      setIsLoading(false);
    }
  };
  const loginWithPopup = async () => {
    // setPopupOpen(true);
    try {
      setIsLoading(true);
      await auth0Client.loginWithPopup();
    } catch (error) {
      if (error instanceof Error) setError(error);
      else console.error(error);
    } finally {
      // setPopupOpen(false);
      setIsLoading(false);
    }

    setUser(await auth0Client.getUser());
    setIsAuthenticated(await auth0Client.isAuthenticated());
  };

  const value: AuthContextValue = {
    isAuthenticated,
    error,
    user,
    isLoading,
    loginWithPopup,
    logout,
    getAccessTokenSilently,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
