import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import FormModal from '../forms/FormModal';
import ExperimentCreationForm from './ExperimentForm';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

interface ExperimentCreationModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentCreationModal({
  setIsLoading,
}: ExperimentCreationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormModal
      triggerButtonIcon={<CirclePlus />}
      triggerButtonText="Create Experiment"
      title="Create a New Experiment"
      formId={CREATE_EXPERIMENT_FORM_ID}
      confirmButtonText="Create"
      open={open}
      setOpen={setOpen}
    >
      <ExperimentCreationForm
        formId={CREATE_EXPERIMENT_FORM_ID}
        setIsLoading={setIsLoading}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
