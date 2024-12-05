import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import FormModal from '../forms/FormModal';
import ExperimentCreationForm from './ExperimentForm';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

interface FeatureFlagCreationModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentCreationModal({
  setIsLoading,
}: FeatureFlagCreationModalProps) {
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
