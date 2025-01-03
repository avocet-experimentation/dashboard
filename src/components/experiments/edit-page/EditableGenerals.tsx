import { Editable, HStack, Text } from '@chakra-ui/react';

export function EditableGenerals({
  fieldName = '',
  includeName = false,
  defaultValue,
  inputType,
  onValueCommit,
}: {
  fieldName?: string;
  includeName?: boolean;
  defaultValue: string;
  inputType: 'text' | 'number';
  onValueCommit: any;
}) {
  return (
    <HStack gap={2} alignItems="center">
      {includeName && <Text>{fieldName}:</Text>}
      <Editable.Root
        activationMode="dblclick"
        defaultValue={defaultValue}
        fontSize="inherit"
        onValueCommit={onValueCommit}
      >
        <Editable.Preview _hover={{ bg: 'avocet-hover' }} />
        <Editable.Input type={inputType} />
      </Editable.Root>
    </HStack>
  );
}
