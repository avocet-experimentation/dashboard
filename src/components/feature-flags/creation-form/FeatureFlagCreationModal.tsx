import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import FormModal from '#/components/forms/FormModal';
import FeatureFlagCreationForm from './FeatureFlagCreationForm';
import { CREATE_FEATURE_FORM_ID } from '../feature-constants';

export default function FeatureFlagCreationModal() {
  const [open, setOpen] = useState(false);

  return (
    <FormModal
      triggerButtonIcon={<CirclePlus />}
      formId={CREATE_FEATURE_FORM_ID}
      open={open}
      setOpen={setOpen}
      title="Create a New Feature Flag"
      confirmButtonText="Create"
      triggerButtonText="Create Flag"
    >
      <FeatureFlagCreationForm
        formId={CREATE_FEATURE_FORM_ID}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
