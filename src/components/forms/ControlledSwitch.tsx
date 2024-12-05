import { Flex, Text } from '@chakra-ui/react';
import {
  FieldValues,
  Controller,
  FieldPath,
  useFormContext,
} from 'react-hook-form';
import { Switch } from '../ui/switch';
import { Field } from '../ui/field';

interface ControlledSwitchProps<
  T extends FieldValues,
  K extends FieldPath<T> = FieldPath<T>,
> {
  fieldPath: K;
  label: string;
  labelPosition: 'right' | 'left';
  switchId: string;
}

/**
 * Requires the form to be wrapped in a FormProvider
 */
export default function ControlledSwitch<T extends FieldValues>({
  fieldPath,
  label,
  labelPosition,
  switchId,
}: ControlledSwitchProps<T>) {
  const { control, formState } = useFormContext<T>();

  return (
    <Controller
      name={fieldPath}
      control={control}
      render={({ field }) => (
        <Flex>
          {labelPosition === 'left' && <Text marginRight="5px">{label}</Text>}
          <Switch
            id={switchId}
            name={field.name}
            checked={!!field.value}
            onCheckedChange={({ checked }) => field.onChange(checked)}
            onBlur={field.onBlur}
            width="fit-content"
          >
            {labelPosition === 'right'
              && 'Enabled by default for new feature flags'}
          </Switch>
        </Flex>
      )}
    />
  );
}
