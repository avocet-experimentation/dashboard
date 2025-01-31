import {
  Editable,
  EditableValueChangeDetails,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';

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
  onValueCommit: (details: EditableValueChangeDetails) => void;
}) {
  return (
    <Editable.Root
      activationMode="dblclick"
      defaultValue={defaultValue}
      fontSize="inherit"
      onValueCommit={onValueCommit}
    >
      <HStack gap={2} alignItems="center">
        {includeName && <Heading size={'sm'}>{fieldName}</Heading>}
        <Editable.Preview _hover={{ bg: 'avocet-hover' }} />
        <Editable.Input type={inputType} />
      </HStack>
    </Editable.Root>
  );
}
