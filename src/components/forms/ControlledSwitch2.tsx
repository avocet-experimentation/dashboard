import { Flex, Text } from '@chakra-ui/react';
import {
  FieldValues,
  Controller,
  FieldPath,
  useFormContext,
} from 'react-hook-form';
import { Switch } from '../ui/switch';

interface ControlledSwitch2Props<
  T extends FieldValues,
  K extends FieldPath<T> = FieldPath<T>,
> {
  fieldPath: K;
  label: string;
  labelPosition: 'right' | 'left';
  switchId?: string;
}

/**
 * (WIP) alternative switch using onChange instead of onCheckedChange
 * Requires the form to be wrapped in a FormProvider
 */
export default function ControlledSwitch2<T extends FieldValues>({
  fieldPath,
  label,
  labelPosition,
  switchId,
}: ControlledSwitch2Props<T>) {
  const { control, formState } = useFormContext<T>();
  // console.log('fieldPath:', fieldPath);

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
            onChange={(e: React.FormEvent<HTMLLabelElement>) => {
              console.log('switch event target:');
              console.table(
                Object.entries(e.target).filter(
                  ([key, value]) => value !== null && value !== undefined,
                ),
              );
              console.log({
                fieldName: field.name,
                fieldPath,
                matches: field.name === fieldPath,
              });
              return field.onChange(e.target.checked);
            }}
            onBlur={field.onBlur}
            width="fit-content"
          >
            {labelPosition === 'right' && (
              <Text marginRight="5px">{label}</Text>
            )}
          </Switch>
        </Flex>
      )}
    />
  );
}
