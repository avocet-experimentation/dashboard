import { Input } from '@chakra-ui/react';
import { Controller, Control, UseFormRegister } from 'react-hook-form';
import { ForcedValue } from '@estuary/types';
import { Switch } from '../ui/switch';
import { Field } from '../ui/field';

interface OverrideValueFieldProps {
  control: Control<ForcedValue>;
  register: UseFormRegister<ForcedValue>;
  valueType: 'string' | 'number' | 'boolean';
}

export default function OverrideValueField({
  control,
  register,
  valueType,
}: OverrideValueFieldProps) {
  return (
    <Controller
      name="value"
      control={control}
      render={({ field }) => (
        <Field label="Value to Force">
          {valueType === 'string' && (
            <Input
              placeholder={`A ${valueType} value`}
              defaultValue=""
              {...register('value', {
                required: 'A forced value is required.',
              })}
            />
          )}
          {valueType === 'boolean' && (
            <Switch
              name={field.name}
              checked={!!field.value}
              onCheckedChange={({ checked }) => field.onChange(checked)}
              inputProps={{ onBlur: field.onBlur }}
            >
              {field.value ? 'on' : 'off'}
            </Switch>
          )}
          {valueType === 'number' && (
            <Input
              type="number"
              placeholder="A number value"
              {...register('value', {
                valueAsNumber: true,
                required: 'A default value is required.',
              })}
            />
          )}
        </Field>
      )}
    />
  );
}
