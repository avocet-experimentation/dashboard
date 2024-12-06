import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { Environment } from '@estuary/types';
import FormModal from '#/components/forms/FormModal';
import FeatureFlagCreationForm from './FeatureFlagCreationForm';
import { CREATE_FEATURE_FORM_ID } from '../feature-constants';

interface FeatureFlagCreationModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  environments: Environment[];
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
