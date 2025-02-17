import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { FlagValueTypeDef, OverrideRuleUnion, RuleType } from '@avocet/core';
import {
  RULE_TYPES,
  RuleTypeDisplayDataTuple,
} from '#/components/feature-flags/feature-constants';
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from '#/components/ui/radio-card';
import ForcedValueInitForm from './ForcedValueInitForm';
import ExperimentInitModal from '#/components/experiments/ExperimentInitModal';

interface RuleTypeSelectorProps {
  setRuleType: React.Dispatch<React.SetStateAction<OverrideRuleUnion['type']>>;
}

function RuleTypeSelector({ setRuleType }: RuleTypeSelectorProps) {
  return (
    <RadioCardRoot
      orientation="vertical"
      justify="center"
      onValueChange={(e) => {
        setRuleType(e.value as RuleType);
      }}
    >
      <RadioCardLabel textStyle="sm" fontWeight="medium">
        Select rule type:
      </RadioCardLabel>
      {(Object.entries(RULE_TYPES) as RuleTypeDisplayDataTuple[]).map(
        ([ruleKey, rule]) => (
          <RadioCardItem
            cursor="pointer"
            label={rule.name}
            description={rule.description}
            indicator={false}
            key={ruleKey}
            value={ruleKey}
          />
        ),
      )}
    </RadioCardRoot>
  );
}

interface RuleFormProps {
  formId: string;
  featureFlagId: string;
  valueType: FlagValueTypeDef;
  environmentName: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Allows users to select an override rule type and provide the mandatory fields
 * from which to create a template
 *
 * todo:
 * - redirect users to (or embed) ExperimentForm if they select experiments
 * - add a route for this form, and navigate back to the flag's page on
 * successful submission
 */
export default function RuleCreationForm({
  formId,
  featureFlagId,
  valueType,
  environmentName,
  setOpen,
}: RuleFormProps) {
  const [ruleType, setRuleType] =
    useState<OverrideRuleUnion['type']>('ForcedValue');

  return (
    <Flex direction="column">
      <RuleTypeSelector setRuleType={setRuleType} />
      {ruleType === 'ForcedValue' && (
        <ForcedValueInitForm
          valueType={valueType}
          envName={environmentName}
          formId={formId}
          flagId={featureFlagId}
          setOpen={setOpen}
        />
      )}
      {ruleType === 'Experiment' && <ExperimentInitModal />}
    </Flex>
  );
}
