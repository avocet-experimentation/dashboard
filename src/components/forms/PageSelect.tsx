import {
  createListCollection,
  ListCollection,
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
import { useState } from 'react';

interface PageSelectProps<O extends { label: string; value: unknown }> {
  options: O[];
  selected?: O[];
  label?: string;
  placeholder?: string;
  handleValueChange?: (
    value: SelectValueChangeDetails<O>['value'][number],
  ) => void;
  disabled?: boolean;
  multiple?: boolean;
  /** Sets the width of the select. Defaults to 320px */
  width?: string;
}

/**
 * (WIP) Dropdown controlled with useState. Pass the `handleValueChange` prop
 *  to do additional work with selected values
 */
export default function PageSelect<
  O extends { label: string; value: unknown },
>({
  options,
  selected,
  label,
  placeholder = 'select an option',
  handleValueChange,
  disabled,
  multiple,
  width = '320px',
}: PageSelectProps<O>) {
  const optionCollection = createListCollection({ items: options });
  const [selections, setSelections] = useState<any[]>(
    selected?.map((el) => el.value) ?? [],
  );

  return (
    <Field label={label} width={width}>
      <SelectRoot
        value={selections}
        cursor="pointer"
        collection={optionCollection}
        disabled={disabled}
        multiple={multiple}
        onValueChange={(e: SelectValueChangeDetails<O>) => {
          setSelections(e.value);
          handleValueChange?.(e.value[0]);
        }}
        // onInteractOutside={() => field.onBlur()}
      >
        <SelectTrigger>
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent zIndex="popover">
          {optionCollection.items.map((option) => (
            <SelectItem item={option} key={option.label} cursor="pointer">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}
