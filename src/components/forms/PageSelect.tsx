import {
  Box,
  createListCollection,
  SelectValueChangeDetails,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '#/components/ui/select';
import { Field } from '#/components/ui/field';

interface PageSelectProps<O extends { label: string; value: string }> {
  options: O[];
  selected?: string[];
  label?: string;
  placeholder?: string;
  /** Typically a mutation function */
  handleValueChange?: (value: SelectValueChangeDetails<O>['value']) => void;
  disabled?: boolean;
  multiple?: boolean;
  /** Sets the width of the select. Defaults to 100%*/
  width?: string;
}

/**
 * Dropdown to be used with react-query fetching in the parent component.
 * TODO:
 * - fix styling cutting off bottom of some characters in placeholder text
 */
export default function PageSelect<O extends { label: string; value: string }>({
  options,
  selected = [],
  label,
  placeholder = 'select an option',
  handleValueChange,
  disabled,
  multiple,
  width = '100%',
}: PageSelectProps<O>) {
  const optionCollection = createListCollection({ items: options });

  return (
    <Box width={width}>
      <SelectRoot
        value={selected}
        cursor="pointer"
        collection={optionCollection}
        disabled={disabled || !options}
        multiple={multiple}
        onValueChange={(e: SelectValueChangeDetails<O>) => {
          handleValueChange?.(e.value);
        }}
        // size={'md'}
        // onInteractOutside={() => field.onBlur()}
      >
        <SelectLabel>{label}</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent bg="avocet-section" zIndex="popover">
          {optionCollection.items.map((option) => (
            <SelectItem
              item={option}
              key={option.value}
              cursor="pointer"
              _hover={{ bg: 'avocet-hover' }}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
