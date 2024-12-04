import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import FormModalTrigger from '../FormModal';
import EnvironmentManagementForm from './EnvironmentManagementForm';
import { Environment } from '@estuary/types';

const ENVIRONMENT_MANAGEMENT_FORM_ID = 'environment-management-form';

interface EnvironmentManagementModalProps {
  // formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  environment?: Environment;
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateEnvironment: (updated: Environment) => void;
}

export default function EnvironmentManagementModal({
  environment,
  setEnvironments,
  updateEnvironment,
  setIsLoading,
}: EnvironmentManagementModalProps) {
  const [open, setOpen] = useState(false);

  const formModalProps = environment
    ? {
        title: `Modify "${environment?.name}" Environment`,
        confirmButtonText: 'Update',
        triggerButtonText: environment?.name,
      }
    : {
        title: 'Create a New Environment',
        confirmButtonText: 'Create',
        triggerButtonText: 'Add Environment',
      };

  return (
    <FormModalTrigger
      triggerButtonIcon={<CirclePlus />}
      formId={ENVIRONMENT_MANAGEMENT_FORM_ID}
      open={open}
      setOpen={setOpen}
      {...formModalProps}
    >
      <EnvironmentManagementForm
        formId={ENVIRONMENT_MANAGEMENT_FORM_ID}
        setIsLoading={setIsLoading}
        setEnvironments={setEnvironments}
        updateEnvironment={updateEnvironment}
        environment={environment}
        setOpen={setOpen}
      />
    </FormModalTrigger>
  );
}
