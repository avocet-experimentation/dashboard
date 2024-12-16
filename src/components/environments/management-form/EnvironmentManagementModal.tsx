import { CirclePlus, CircleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { Environment } from '@avocet/core';
import FormModal from '../../forms/FormModal';
import EnvironmentManagementForm from './EnvironmentManagementForm';

const ENVIRONMENT_MANAGEMENT_FORM_ID = 'environment-management-form';

interface EnvironmentManagementModalProps {
  // formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  environment?: Environment;
  // setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateEnvironment: (updated: Environment) => void;
}

export default function EnvironmentManagementModal({
  environment,
  // setEnvironments,
  updateEnvironment,
  setIsLoading,
}: EnvironmentManagementModalProps) {
  const [open, setOpen] = useState(false);

  const formModalProps = environment
    ? {
        title: `Modify "${environment?.name}" Environment`,
        confirmButtonText: 'Update',
        triggerButtonText: environment?.name,
        triggerButtonIcon: <CircleEllipsis />,
      }
    : {
        title: 'Create a New Environment',
        confirmButtonText: 'Create',
        triggerButtonText: 'Add Environment',
        triggerButtonIcon: <CirclePlus />,
      };

  return (
    <FormModal
      formId={ENVIRONMENT_MANAGEMENT_FORM_ID}
      open={open}
      setOpen={setOpen}
      {...formModalProps}
    >
      <EnvironmentManagementForm
        formId={ENVIRONMENT_MANAGEMENT_FORM_ID}
        setIsLoading={setIsLoading}
        // setEnvironments={setEnvironments}
        updateEnvironment={updateEnvironment}
        environment={environment}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
