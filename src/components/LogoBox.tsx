import { chakra, Flex, Text } from '@chakra-ui/react';
import AvocetLogo from '../assets/svgs/avocet-logo.svg';
import AvocetLogo2 from '../assets/svgs/avocet-flying.svg'

export default function LogoBox({withLine=true, withTitle=false, logoSize="45px"}: {withLine: boolean, withTitle: boolean, logoSize: string}) {
  return (
    <Flex
      borderBottom={withLine ? "1px solid" : ""}
      borderColor="gray.400"
      width="100%"
      height="60px"
      marginBottom="25px"
      alignItems="center"
      justifyContent="center"
    >
      <chakra.img src={AvocetLogo2} height={logoSize} />
      {withTitle && <Text fontFamily="Pacifico" fontSize="2em">
        avocet
      </Text>}
    </Flex>
  );
};