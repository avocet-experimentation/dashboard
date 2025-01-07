import { HStack, Icon, Text } from '@chakra-ui/react';
import { CircleAlert } from 'lucide-react';

export default function InfoWarning({ message }: { message: string }) {
  return (
    <HStack>
      <Icon size="md" color="orange">
        <CircleAlert />
      </Icon>
      <Text color="orange">{message}</Text>
    </HStack>
  );
}
