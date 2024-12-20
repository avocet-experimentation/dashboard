/* for now, links to EventTable and FlagTable only
 */

import { Flex, chakra, Icon, Text } from '@chakra-ui/react';
import {
  Flag,
  Microscope,
  TestTubes,
  AlignHorizontalDistributeCenter,
  Earth,
  Cable,
} from 'lucide-react';
import { Link } from 'wouter';
import LogoBox from './LogoBox';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from './ui/avatar';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from './ui/menu';
import { Button } from './ui/button';

const NavBox = chakra('div', {
  base: {
    width: '90%',
    borderRadius: '5px',
    color: 'black',
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '1.15em',
    padding: '0 20px',
    _hover: {
      bg: 'gray.100',
    },
  },
});

const NavText = chakra('p', {
  base: {
    color: 'black',
    textDecoration: 'none',
    padding: '15px',
    width: '200px',
  },
});

export default function Navbar() {
  const { user, logout } = useAuth0();

  return (
    <Flex
      direction="column"
      bg="white"
      alignItems="center"
      border="1px solid black"
      borderRadius="5px"
      height="98%"
      width="90%"
      margin="auto"
    >
      <LogoBox withLine={true} withTitle={true} logoSize="45px"/>
      <NavBox>
        <Icon>
          <Flag />
        </Icon>
        <Link href="/features" draggable={false}>
          <NavText>Features</NavText>
        </Link>
      </NavBox>
      <NavBox>
        <Icon>
          <TestTubes />
        </Icon>
        <Link href="/experiments" draggable={false}>
          <NavText>Experiments</NavText>
        </Link>
      </NavBox>
      <NavBox>
        <Icon>
          <AlignHorizontalDistributeCenter />
        </Icon>
        <Link href="/telemetry" draggable={false}>
          <NavText>Telemetry Data</NavText>
        </Link>
      </NavBox>
      <NavBox>
        <Icon>
          <Microscope />
        </Icon>
        <Link href="/insights" draggable={false}>
          <NavText>Insights</NavText>
        </Link>
      </NavBox>
      <NavBox>
        <Icon>
          <Earth />
        </Icon>
        <Link href="/environments" draggable={false}>
          <NavText>Environments</NavText>
        </Link>
      </NavBox>
      <NavBox>
        <Icon>
          <Cable />
        </Icon>
        <Link href="/connections" draggable={false}>
          <NavText>Connections</NavText>
        </Link>
      </NavBox>
      <MenuRoot positioning={{ placement: "top" }}>
        <MenuTrigger asChild marginTop="auto" marginBottom="15px">
          <Button width="90%" height="fit-content" justifyContent="space-evenly" variant="ghost" padding="10px">
            <Avatar name={user?.name} src={user?.picture} size="sm"/>
            <Text>
              {user?.email}
            </Text>
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="Logout" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error", cursor: "pointer" }} onClick={logout}>Logout</MenuItem>
        </MenuContent>
      </MenuRoot>
    </Flex>
  );
}
