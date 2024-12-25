import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Avatar } from './ui/avatar';
import { useState } from 'react';
import { Button } from './ui/button';

export default function UserProfile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);

  const callApi = async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER_URL;
    const authAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: authAudience,
        }
      });
      const response = await fetch(`${apiUrl}/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.log('API error:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const result = await callApi();
      setData(result);
    } catch (error) {
      console.error(error);
      setData(error);
    } 
  }
  return (
    <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
      <Heading size="3xl">Your Profile</Heading>
      <Flex dir="row" maxWidth="300px" justifyContent="space-between" alignItems="center">
        <Avatar src={user?.picture} width="100px" height="100px" />
        <Stack textAlign="left">
          <Text fontSize="2xl">{user?.name}</Text>
          <Text fontSize="lg">{user?.email}</Text>
        </Stack>
      </Flex>
      <Stack gap={2} width="100%" alignItems="center">
        <Button width="500px" onClick={fetchData}>
          Fetch Data
        </Button>
        <Text width="500px" height="200px" overflowY="scroll">{(data && (data.token || data.error)) ?? "No data"}</Text>
      </Stack>
    </Stack>
  )
}