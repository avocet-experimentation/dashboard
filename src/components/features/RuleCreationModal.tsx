import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FeatureFlag } from '@estuary/types';
import FormModal from '../forms/FormModal';
import RuleInitializationForm from './RuleForm';

const ADD_RULE_FORM_ID = 'add-rule-form';

interface RuleModalProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  featureFlag: FeatureFlag;
  environmentName: string;
  // updateFlag: (updated: FeatureFlag) => void;
}

export default function RuleCreationModal({
  featureFlag,
  environmentName,
  // updateFlag,
  setIsLoading,
}: RuleModalProps) {
  const [open, setOpen] = useState(false);

  if (!(environmentName in featureFlag.environmentNames)) {
    throw new Error(
      `Flag ${featureFlag.name} not enabled on environment`
        + ` ${environmentName}. This is likely a mistake!`,
    );
  }
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
      <RuleInitializationForm
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
