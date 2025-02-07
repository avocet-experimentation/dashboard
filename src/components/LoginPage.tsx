import { Button } from './ui/button';
import { Card, Stack } from '@chakra-ui/react';
import LogoBox from './LogoBox';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '#/lib/UseAuth';

export default function LoginPage() {
  const { loginWithPopup, isAuthenticated } = useAuth();
  const [params, navigate] = useLocation();

  const handleLoginWithPopup = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error('Error during login: ', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <Stack
      bg="avocet-bg"
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Card.Root
        bg="avocet-section"
        width="300px"
        alignItems="center"
        variant="outline"
      >
        <Card.Body gap="2.5">
          <LogoBox withLine={true} withTitle={true} logoSize="65px" />
          <Button
            bg="avocet-text"
            color="avocet-bg"
            onClick={handleLoginWithPopup}
          >
            Log in with Auth0
          </Button>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card.Root>
    </Stack>
  );
}
