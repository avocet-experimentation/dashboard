import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { Environment, FeatureFlag } from '@estuary/types';
import FormModal from '../forms/FormModal';
import FeatureFlagCreationForm from './FeatureForm';

const CREATE_FEATURE_FORM_ID = 'create-feature-form';

interface FeatureFlagCreationModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  environments: Environment[];
  updateFlag: (updated: FeatureFlag) => void;
}

export default function FeatureFlagCreationModal({
  setIsLoading,
  environments,
}: FeatureFlagCreationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormModal
      triggerButtonIcon={<CirclePlus />}
      formId={CREATE_FEATURE_FORM_ID}
      open={open}
      setOpen={setOpen}
      title="Create a New Feature Flag"
      confirmButtonText="Create"
      triggerButtonText="Add Feature Flag"
    >
      <FeatureFlagCreationForm
        formId={CREATE_FEATURE_FORM_ID}
        setIsLoading={setIsLoading}
        environments={environments}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
