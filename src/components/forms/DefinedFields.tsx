import { useFormContext } from 'react-hook-form';
import ControlledTextInput from './ControlledTextInput';

/**
 * These components require the parent form be wrapped in a FormProvider
 */
export function NameField({ label }: { label: string }) {
  const { register } = useFormContext();
  return (
    <ControlledTextInput
      label={label}
      fieldPath="name"
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

export function DescriptionField({
  label = 'Description',
}: {
  label?: string;
}) {
  const { register } = useFormContext();
  return (
    <ControlledTextInput
      label={label}
      fieldPath="description"
      registerReturn={register('description', {
        required: 'A description is required.',
      })}
    />
  );
}
