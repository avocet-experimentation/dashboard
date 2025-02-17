import { Avatar } from './ui/avatar';
import { Text } from '@chakra-ui/react';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from './ui/menu';
import { Button } from './ui/button';
import { Link } from 'wouter';
import { useAuth } from '#/lib/UseAuth';

export function UserProfileMenu() {
  const { user, logout } = useAuth();
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
          _open={{ bg: 'avocet-hover' }}
          _hover={{ bg: 'avocet-hover' }}
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
      <MenuContent bg="avocet-section">
        <Link href="/profile" draggable={false}>
          <MenuItem value="Profile">Profile</MenuItem>
        </Link>
        <MenuItem
          value="Logout"
          color="avocet-fg-error"
          draggable={false}
          _hover={{
            bg: 'avocet-error-bg',
            color: 'avocet-error-fg',
          }}
          onClick={() => logout()}
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
