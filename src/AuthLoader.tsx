import { HStack, Text, VStack, Spinner } from '@chakra-ui/react';
import LogoBox from './components/LogoBox';

export default function AuthLoader({ message }: { message: string }) {
  return (
    <VStack
      bg="avocet-bg"
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
    >
      <LogoBox withLine={false} withTitle={false} logoSize="100px" />
      <HStack>
        <Spinner
          size="lg"
          animationDuration="0.8s"
          borderWidth="4px"
          colorPalette="avocet-bg"
        />
        <Text fontSize="2xl">{message}</Text>
      </HStack>
    </VStack>
  );
}
