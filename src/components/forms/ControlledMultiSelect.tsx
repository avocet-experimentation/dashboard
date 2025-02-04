import {
  createListCollection,
  SelectRootProps,
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
import {
  Controller,
  useFormContext,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';

interface ControlledMultiSelectProps<
  T,
  O extends { label: string; value: PathValue<T, Path<T>> },
> {
  label?: string;
  fieldPath: Path<T>;
  placeholder?: string;
  options: O[];
  handleValueChange?: (value: SelectValueChangeDetails<O>['value']) => void;
  /** Sets the width of the select. Defaults to 320px */
  width?: string;
}

/**
 * (WIP) Dropdown for selecting one or more options, controlled via
 * react-hook-form. Expects the form to be wrapped in a FormContextProvider.
 */
export default function ControlledMultiSelect<
  T extends FieldValues,
  O extends { label: string; value: PathValue<T, Path<T>> },
>({
  label,
  fieldPath,
  placeholder = 'select an option',
  options,
  handleValueChange,
  width = '320px',
  ...otherSelectRootProps
}: ControlledMultiSelectProps<T, O> &
  Omit<SelectRootProps, 'collection' | 'multiple'>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const optionCollection = createListCollection({ items: options });

  return (
    <Field
      label={label}
      invalid={!!errors[fieldPath]}
      errorText={(errors[fieldPath]?.message as string) ?? undefined}
      width={width}
    >
      <Controller
        control={control}
        name={fieldPath}
        render={({ field }) => (
          <SelectRoot
            name={field.name}
            value={field.value}
            cursor="pointer"
            collection={optionCollection}
            multiple
            onValueChange={(e: SelectValueChangeDetails<O>) => {
              field.onChange(e.value);
              handleValueChange?.(e.value);
            }}
            onInteractOutside={() => field.onBlur()}
            {...otherSelectRootProps}
          >
            <SelectTrigger>
              <SelectValueText placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent bg="avocet-dropdown-bg" zIndex="popover">
              {optionCollection.items.map((option) => (
                <SelectItem
                  item={option}
                  key={option.label}
                  cursor="pointer"
                  _hover={{ bg: 'avocet-hover' }}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      />
    </Field>
  );
}
