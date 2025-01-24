import {
  Editable,
  EditableValueChangeDetails,
  Heading,
  HeadingProps,
  HStack,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { X, Check, FilePenLine } from 'lucide-react';
import { useState } from 'react';
import PageSection from '../helpers/PageSection';

interface PageEditableProps {
  label?: string;
  labelSize?: HeadingProps['size'];
  initialValue: string;
  submitHandler: (e: EditableValueChangeDetails) => void;
  startInEditMode?: boolean;
  disabled?: boolean;
}
/**
 * (WIP) For managing string fields on objects.
 * @param submitHandler a callback to write changes to a database,
 * returning the new value or the previous value if writing fails
 */
export default function PageEditable({
  label,
  labelSize = 'lg',
  initialValue,
  submitHandler,
  startInEditMode = false,
  disabled = false,
}: PageEditableProps) {
  const [value, setValue] = useState<string>(initialValue);

  return (
    <Editable.Root
      disabled={disabled}
      value={value}
      defaultEdit={startInEditMode}
      selectOnFocus={false}
      activationMode="click"
      onValueChange={(e) => setValue(e.value)}
      onValueCommit={async (e) => submitHandler(e)}
      submitMode="enter"
    >
      <PageSection>
        <HStack gap={2.5}>
          {label && <Heading size={labelSize}>{label}</Heading>}
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs">
                <FilePenLine />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs">
                <X />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs">
                <Check />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </HStack>
        <Editable.Preview
          minH="48px"
          alignItems="flex-start"
          width="full"
          _hover={{ bg: 'avocet-hover' }}
        />
        <Editable.Textarea />
      </PageSection>
    </Editable.Root>
  );
}
