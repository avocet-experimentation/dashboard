import { chakra, Flex, Text } from '@chakra-ui/react';
import AvocetLogo from '../assets/svgs/avocet-flying.svg'
import AvocetLogoWithTitle from '../assets/svgs/avocet-logo-with-title.svg'

interface LogoProps {
  withLine: boolean;
  withTitle: boolean;
  logoSize: string;
}

export default function LogoBox({withLine=true, withTitle=false, logoSize="45px"}: LogoProps) {
  return (
    <Flex
      borderBottom={withLine ? "1px solid" : ""}
      borderColor="gray.400"
      width="100%"
      marginBottom="25px"
      alignItems="center"
      justifyContent="center"
      padding="15px 0px"
    >
      <chakra.img src={withTitle ? AvocetLogoWithTitle : AvocetLogo} height={logoSize} draggable="false"/>
    </Flex>
  );
};