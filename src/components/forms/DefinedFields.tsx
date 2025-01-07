import { useFormContext } from 'react-hook-form';
import ControlledTextInput from './ControlledTextInput';

interface NameFieldProps {
  label: string;
  disabled?: boolean;
  helperText?: string;
}

/**
 * These components require the parent form be wrapped in a FormProvider
 */
export function NameField({
  label,
  helperText = undefined,
  disabled = false,
}: NameFieldProps) {
  const { register } = useFormContext();
  return (
    <ControlledTextInput
      label={label}
      helperText={helperText}
      fieldPath="name"
      disabled={disabled}
      registerReturn={register('name', {
        required:
          'A name is required and must be between 3-20 characters long.',
        pattern: {
          value: /^[0-9A-Za-z-]+$/gi,
          message: 'Names may only contain letters, numbers, and hyphens.',
        },
        minLength: 3,
        maxLength: 20,
      })}
    />
  );
}

interface DescriptionFieldProps {
  label?: string;
  disabled?: boolean;
}

export function DescriptionField({
  label = 'Description (optional)',
  disabled = false,
}: DescriptionFieldProps) {
  const { register } = useFormContext();
  return (
    <ControlledTextInput
      label={label}
      fieldPath="description"
      disabled={disabled}
      registerReturn={register('description')}
    />
  );
}

export function HypothesisField({
  label = 'Hypothesis (optional)',
}: {
  label?: string;
}) {
  const { register } = useFormContext();
  return (
    <ControlledTextInput
      label={label}
      fieldPath="hypothesis"
      registerReturn={register('hypothesis')}
    />
  );
}
