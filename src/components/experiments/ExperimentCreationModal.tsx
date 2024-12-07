import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import ExperimentCreationForm from './ExperimentForm';
import MultiFormModal from '../forms/MultiFormModal';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

interface ExperimentCreationModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentCreationModal({
  setIsLoading,
}: ExperimentCreationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <MultiFormModal
      triggerButtonIcon={<CirclePlus />}
      triggerButtonText="Create Experiment"
      title="Create a New Experiment"
      formId={CREATE_EXPERIMENT_FORM_ID}
      confirmButtonText="Create"
      open={open}
      setOpen={setOpen}
      numberOfSteps={2}
    >
      <ExperimentCreationForm
        formId={CREATE_EXPERIMENT_FORM_ID}
        setIsLoading={setIsLoading}
        setOpen={setOpen}
      />
    </MultiFormModal>
  );
}
