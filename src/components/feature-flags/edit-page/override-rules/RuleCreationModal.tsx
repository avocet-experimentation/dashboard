import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FeatureFlag } from '@estuary/types';
import FormModal from '../../../forms/FormModal';
import RuleCreationForm from './RuleCreationForm';
import { ADD_RULE_FORM_ID } from '../../feature-constants';

interface RuleModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  featureFlag: FeatureFlag;
  environmentName: string;
}

export default function RuleCreationModal({
  featureFlag,
  environmentName,
  setIsLoading,
}: RuleModalProps) {
  const [open, setOpen] = useState(false);

  // if (!(environmentName in featureFlag.environmentNames)) {
  //   throw new Error(
  //     `Flag "${featureFlag.name}" not enabled on environment` +
  //       ` ${environmentName}. This is likely a bug!`,
  //   );
  // }

  return (
    <FormModal
      triggerButtonIcon={<CirclePlus />}
      triggerButtonText="Add Rule"
      title={`Add a new rule to ${environmentName}`}
      formId={ADD_RULE_FORM_ID}
      confirmButtonText="Save"
      open={open}
      setOpen={setOpen}
    >
      <RuleCreationForm
        formId={ADD_RULE_FORM_ID}
        setIsLoading={setIsLoading}
        valueType={featureFlag.value.type}
        environmentName={environmentName}
        featureFlagId={featureFlag.id}
        setOpen={setOpen}
      />
    </FormModal>
  );
}
