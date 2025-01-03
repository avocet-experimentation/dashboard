import { chakra, Flex } from '@chakra-ui/react';
import AvocetLogoLightMode from '../assets/svgs/avocet-logo-light-mode.svg';
import AvocetLogoDarkMode from '../assets/svgs/avocet-logo-dark-mode.svg';
import AvocetLogoWithTitleLightMode from '../assets/svgs/avocet-logo-with-title-light-mode.svg';
import AvocetLogoWithTitleDarkMode from '../assets/svgs/avocet-logo-with-title-dark-mode.svg';
import { useColorModeValue } from './ui/color-mode';

interface LogoProps {
  withLine: boolean;
  withTitle: boolean;
  logoSize: string;
}

export default function LogoBox({
  withLine = true,
  withTitle = false,
  logoSize = '45px',
}: LogoProps) {
  const logo = useColorModeValue(AvocetLogoLightMode, AvocetLogoDarkMode);
  const logoWithTitle = useColorModeValue(
    AvocetLogoWithTitleLightMode,
    AvocetLogoWithTitleDarkMode,
  );

  return (
    <Flex
      borderBottom={withLine ? '1px solid' : ''}
      borderColor="gray.400"
      width="100%"
      marginBottom="25px"
      alignItems="center"
      justifyContent="center"
      padding="15px 0px"
    >
      <chakra.img
        src={withTitle ? logoWithTitle : logo}
        height={logoSize}
        draggable="false"
      />
    </Flex>
  );
}
