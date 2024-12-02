import { ListCollection } from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';
import { Field } from '../ui/field';
import {
  FeatureFlagDraft,
  flagDefaultValueMap,
  flagValueTypeDefSchema,
} from '@estuary/types';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

interface FeatureFlagValueTypeProps {
  control: Control<FeatureFlagDraft<'string' | 'number' | 'boolean'>, any>;
  setValue: UseFormSetValue<FeatureFlagDraft<'string' | 'number' | 'boolean'>>;
  valueTypes: ListCollection<{
    label: string;
    value: string;
  }>;
}

export default function FeatureFlagValueTypeField({
  control,
  setValue,
  valueTypes,
}: FeatureFlagValueTypeProps) {
  return (
    <Field label="Value Type" width="320px">
      <Controller
        control={control}
        name="value.type"
        render={({ field }) => (
          <SelectRoot
            name={field.name}
            value={[field.value]}
            collection={valueTypes}
            onValueChange={({ value }) => {
              const selectedValueType = flagValueTypeDefSchema.parse(value[0]);
              field.onChange(value[0]);
              const newDefault = flagDefaultValueMap[selectedValueType];
              console.log({ selectedValueType, newDefault });
              setValue('value.initial', newDefault);
            }}
            onInteractOutside={() => field.onBlur()}
          >
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent zIndex="popover">
              {valueTypes.items.map((type) => (
                <SelectItem item={type} key={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      />
    </Field>
  );
}
