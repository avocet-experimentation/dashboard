import { Input } from '@chakra-ui/react';
import { Field } from '#/components/ui/field';
import { Switch } from '#/components/ui/switch';
import {
  Controller,
  Control,
  UseFormGetValues,
  UseFormRegister,
} from 'react-hook-form';
import { FeatureFlagDraft } from '@avocet/core';

interface FeatureFlagDefaultValueFieldProps {
  control: Control<FeatureFlagDraft, any>;
  getValues: UseFormGetValues<FeatureFlagDraft>;
  register: UseFormRegister<FeatureFlagDraft>;
}

export default function FeatureFlagDefaultValueField({
  control,
  getValues,
  register,
}: FeatureFlagDefaultValueFieldProps) {
  return (
    <Field label="Default Value">
      <Controller
        name="value.initial"
        control={control}
        render={({ field }) => {
          const valueType = getValues('value.type');
          if (valueType === 'boolean')
            return (
              <Switch
                name={field.name}
                checked={!!field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                {!!field.value ? 'on' : 'off'}
              </Switch>
            );
          if (valueType === 'string')
            return (
              <Input
                type="text"
                placeholder="A string value"
                {...register('value.initial', {
                  required: 'A default value is required.',
                })}
              />
            );
          if (valueType === 'number')
            return (
              <Input
                type="number"
                placeholder="A number value"
                {...register('value.initial', {
                  valueAsNumber: true,
                  required: 'A default value is required.',
                })}
              />
            );
          return <></>;
        }}
      />
    </Field>
  );
}
