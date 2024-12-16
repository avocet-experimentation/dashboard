import { createListCollection } from '@chakra-ui/react';
import { RuleType } from '@avocet/core';

export interface RuleTypeData {
  name: string;
  description: string | null;
}

export type RuleTypeDisplayDataTuple = [RuleType, RuleTypeData];

export const RULE_TYPES: Record<RuleType, RuleTypeData> = {
  ForcedValue: {
    name: 'Forced Value',
    description: 'Target groups of users and give them all the same value.',
  },
  Experiment: {
    name: 'Experiment',
    description: 'Measure the impact of this feature on your key metrics.',
  },
};

export const VALUE_TYPES_DISPLAY_LIST = createListCollection({
  items: [
    { label: 'Boolean (on/off)', value: 'boolean' },
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
  ],
});

export const CREATE_FEATURE_FORM_ID = 'create-feature-form';
export const ADD_RULE_FORM_ID = 'add-rule-form';
