import { Input } from '@chakra-ui/react';
import {
  FieldValues,
  // FieldErrors,
  // Control,
  Controller,
  FieldPath,
  UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form';
import { Field } from '../ui/field';

interface ControlledFieldProps<
  T extends FieldValues,
  K extends FieldPath<T> = FieldPath<T>,
> {
  fieldPath: K;
  label: string;
  registerReturn: UseFormRegisterReturn<K>;
}

/**
 * Requires the form to be wrapped in a FormProvider
 */
export default function ControlledTextInput<T extends FieldValues>({
  fieldPath,
  label,
  registerReturn,
}: ControlledFieldProps<T>) {
  const { control, formState } = useFormContext<T>();

  return (
    <Field
      label={label}
      invalid={!!formState.errors[fieldPath]}
      errorText={formState.errors[fieldPath]?.message as string | undefined}
    >
      <Controller
        name={fieldPath}
        control={control}
        render={() => <Input {...registerReturn} />}
      />
    </Field>
  );
}
