import { Stack, StackProps } from '@chakra-ui/react';

export default function PageSection(
  props: React.PropsWithChildren<StackProps>,
) {
  const { children, ...stackProps } = props;
  return (
    <Stack
      padding="15px"
      bg="avocet-section"
      borderRadius="5px"
      width="100%"
      gap={2.5}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}
