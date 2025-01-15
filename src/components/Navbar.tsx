/* for now, links to EventTable and FlagTable only
 */

import { Flex, chakra, Icon } from '@chakra-ui/react';
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
import { UserProfileMenu } from './UserProfileMenu';

const NavBox = chakra('div', {
  base: {
    width: '90%',
    borderRadius: '5px',
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '1.15em',
    padding: '0 20px',
    _hover: {
      bg: 'avocet-hover',
    },
  },
});

const NavText = chakra('p', {
  base: {
    textDecoration: 'none',
    padding: '15px',
    width: '200px',
  },
});

export default function Navbar() {
  return (
    <Flex
      bg="avocet-nav"
      color="avocet-text"
      direction="column"
      alignItems="center"
      border="1px solid"
      // borderColor="avocet-border"
      borderRadius="5px"
      height="98%"
      width="90%"
      margin="auto"
    >
      <LogoBox withLine={true} withTitle={true} logoSize="65px" />
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
          <NavText>Telemetry</NavText>
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
      <UserProfileMenu />
    </Flex>
  );
}
