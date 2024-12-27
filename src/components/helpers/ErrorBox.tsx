import { Text, VStack } from '@chakra-ui/react';
import { Button } from '../ui/button';

export default function ErrorBox({ error }: { error: Error }) {
  return (
    <VStack width="100%" height="50%" justifyContent="center">
      <Text fontSize="xl">{error.message}</Text>
      <Button>Try again</Button>
    </VStack>
  );
}
