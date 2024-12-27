import { Avatar } from './ui/avatar';
import { Text } from '@chakra-ui/react';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from './ui/menu';
import { Button } from './ui/button';
import { Link } from 'wouter';
import { useAuth0 } from '@auth0/auth0-react';

export function UserProfileMenu() {
  const { user, logout } = useAuth0();
  return (
    <MenuRoot positioning={{ placement: 'top' }}>
      <MenuTrigger
        asChild
        border="1px solid"
        borderColor="avocet-border"
        marginTop="auto"
        marginBottom="15px"
      >
        <Button
          width="90%"
          height="fit-content"
          justifyContent="space-evenly"
          variant="ghost"
          padding="10px"
        >
          <Avatar name={user?.name} src={user?.picture} size="sm" />
          <Text>{user?.email}</Text>
        </Button>
      </MenuTrigger>
      <MenuContent>
        <Link href="/profile" draggable={false}>
          <MenuItem value="Profile">Profile</MenuItem>
        </Link>
        <MenuItem
          value="Logout"
          color="fg.error"
          draggable={false}
          _hover={{ bg: 'bg.error', color: 'fg.error', cursor: 'pointer' }}
          onClick={() => logout()}
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
