import { Box, Text } from '@chakra-ui/react';

export default function ErrorBox({ error }: { error: Error }) {
  return (
    <Box>
      <Text>Error: {error.message}</Text>
    </Box>
  );
}
