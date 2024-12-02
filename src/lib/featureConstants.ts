import { RuleType } from '@estuary/types';

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
