import { Input } from '@chakra-ui/react';
import {
  FieldValues,
  Controller,
  FieldPath,
  UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form';
import { Field } from '../ui/field';

export interface ControlledTextInputProps<
  T extends FieldValues,
  K extends FieldPath<T> = FieldPath<T>,
> {
  fieldPath: K;
  registerReturn: UseFormRegisterReturn<K>;
  label?: string;
  helperText?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Requires the form to be wrapped in a FormProvider
 */
export default function ControlledTextInput<T extends FieldValues>({
  fieldPath,
  registerReturn,
  label,
  helperText,
  disabled,
}: ControlledTextInputProps<T>) {
  const { control, formState } = useFormContext<T>();

  return (
    <Field
      label={label}
      invalid={!!formState.errors[fieldPath]}
      helperText={helperText}
      errorText={(formState.errors[fieldPath]?.message as string) ?? undefined}
    >
      <Controller
        name={fieldPath}
        control={control}
        render={() => <Input {...registerReturn} disabled={disabled} />}
      />
    </Field>
  );
}
