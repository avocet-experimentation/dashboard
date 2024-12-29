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
import AvocetLogo from '../assets/svgs/avocet-logo.svg';
import { Link } from 'wouter';

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

const LogoBox = () => {
  return (
    <Flex
      borderBottom="1px solid"
      borderColor="gray.400"
      width="100%"
      height="60px"
      marginBottom="25px"
      alignItems="center"
      justifyContent="center"
    >
      <chakra.img src={AvocetLogo} height="45px" />
      <Text fontFamily="Pacifico" fontSize="2em">
        avocet
      </Text>
    </Flex>
  );
};

export default function Navbar() {
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
      <LogoBox />
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
    </Flex>
  );
}
