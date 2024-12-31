import {
  createListCollection,
  SelectValueChangeDetails,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
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
 * (WIP) Dropdown to be used with react-query fetching in the parent component.
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
    <Field label={label} width={width}>
      <SelectRoot
        value={selected}
        cursor="pointer"
        collection={optionCollection}
        disabled={disabled || !options}
        multiple={multiple}
        onValueChange={(e: SelectValueChangeDetails<O>) => {
          handleValueChange?.(e.value);
        }}
        // onInteractOutside={() => field.onBlur()}
      >
        <SelectTrigger>
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent zIndex="popover">
          {optionCollection.items.map((option) => (
            <SelectItem item={option} key={option.value} cursor="pointer">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}
