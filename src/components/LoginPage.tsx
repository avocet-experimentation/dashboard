import { useAuth0 } from '@auth0/auth0-react'
import { Button } from './ui/button';
import { Card, Stack } from '@chakra-ui/react';
import LogoBox from './LogoBox';
import { useEffect } from 'react';
import { useLocation } from 'wouter';


export default function LoginPage() {
  const { loginWithPopup, isAuthenticated, logout } = useAuth0();
  const [params, navigate] = useLocation();

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  return (
    <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center"> 
      <Card.Root width="300px" alignItems="center" variant="outline">
        <Card.Body gap="2.5">
          <LogoBox withLine={true} withTitle={true} logoSize="45px"/>
          <Card.Title textAlign="center">
            Log in to Avocet
          </Card.Title>
          <Card.Description>
            Avocet uses Auth0 to verify its internal users.
          </Card.Description>
        </Card.Body>
        <Card.Footer>
          <Button onClick={() => loginWithPopup()}>
            Log in with Auth0
          </Button>
        </Card.Footer>
      </Card.Root>
    </Stack>
  )
}

