import { HStack, List, Stack, Text } from '@chakra-ui/react';

export function ElementGridRoot({ children }: React.PropsWithChildren) {
  return (
    <List.Root gap="2" variant="plain">
      {children}
    </List.Root>
  );
}

export function ElementGridCard({
  icon,
  children,
}: React.PropsWithChildren<{
  icon?: React.ReactNode;
}>) {
  return (
    <List.Item>
      <HStack direction="row">
        {icon && <List.Indicator>{icon}</List.Indicator>}
        {children}
      </HStack>
    </List.Item>
  );
}
