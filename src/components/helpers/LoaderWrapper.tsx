import { Box, Text } from '@chakra-ui/react';

export function LoaderWrapper({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Box>{isLoading ? <Text>loading...</Text> : children}</Box>;
}
