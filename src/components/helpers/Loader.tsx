import { Spinner, Text, VStack } from '@chakra-ui/react';

export default function Loader({ label='Fetching...' }: { label?: string }) {
  return (
    <VStack width="100%" height="50%" justifyContent="center">
      <Spinner
        animationDuration="0.8s"  
        borderWidth="4px"
        size="lg"
      />
      <Text fontSize="xl">{label}</Text>
    </VStack>
  );
}
