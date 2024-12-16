import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import FormModal from '../forms/FormModal';
import ExperimentInitForm from './ExperimentInitForm';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

interface ExperimentInitModalProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentInitModal({
  isLoading,
  setIsLoading,
}: ExperimentInitModalProps) {
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
      <ExperimentInitForm
        formId={CREATE_EXPERIMENT_FORM_ID}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setOpen={setOpen}
      />
    </FormModal>
    // <FormModal
    //   triggerButtonIcon={<CirclePlus />}
    //   formId={CREATE_FEATURE_FORM_ID}
    //   open={open}
    //   setOpen={setOpen}
    //   title="Create a New Feature Flag"
    //   confirmButtonText="Create"
    //   triggerButtonText="Add Feature Flag"
    // >
    //   <ExperimentCreationForm
    //     formId={CREATE_FEATURE_FORM_ID}
    //     setIsLoading={setIsLoading}
    //     setOpen={setOpen}
    //   />
    // </FormModal>
  );
}
