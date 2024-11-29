import { Flex, Tabs, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { FeatureFlag, RequireOnly } from '@estuary/types';
import FormModalTrigger from '../FormModal';
import RuleForm from './RuleForm';
import ForcedValueStub from './ForcedValueStub';
import ExperimentReferenceStub from './ExperimentReferenceStub';

const ADD_RULE_FORM_ID = 'add-rule-form';

type EnvironmentTabsProps = RequireOnly<
  FeatureFlag,
  'id' | 'value' | 'environmentNames' | 'overrideRules'
>;

export default function EnvironmentTabs({
  environmentNames,
  value: valueDef,
  id: featureFlagId,
  overrideRules,
}: EnvironmentTabsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // todo: fetch or pass in environment objects to list all environment names
  // set to show in toggle list and rest in something like an overflow dropdown
  const [envNames, setEnvNames] = useState<string[]>(
    Object.keys(environmentNames),
  );
  const [selectedTab, setSelectedTab] = useState<string>(`${envNames[0]}-tab`);

  return (
    <Tabs.Root
      value={selectedTab}
      margin="15px 0 0 0"
      variant="plain"
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List>
        {envNames.map((envName) => {
          const rules = overrideRules.filter(
            (rule) => rule.environmentName === envName,
          );
          return (
            <Tabs.Trigger
              defaultValue={`${envNames[0]}-tab`}
              value={`${envName}-tab`}
              key={`${envName}-tab`}
            >
              {envName} {rules.length}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      <Tabs.ContentGroup>
        {envNames.map((envName) => {
          const rules = overrideRules.filter(
            (rule) => rule.environmentName === envName,
          );
          return (
            <Tabs.Content
              value={`${envName}-tab`}
              key={`${envName}-tab-content`}
              background="whitesmoke"
              padding="15px"
            >
              {!rules.length
                ? 'There are no rules for this environment yet.'
                : rules.map((rule) => {
                    if (rule.type === 'ForcedValue') {
                      return <ForcedValueStub rule={rule} key={rule.id} />;
                    }
                    if (rule.type === 'Experiment') {
                      return (
                        <ExperimentReferenceStub rule={rule} key={rule.id} />
                      );
                    }
                    throw new TypeError(`Rule ${rule} is not handled!`);
                  })}
            </Tabs.Content>
          );
        })}
      </Tabs.ContentGroup>
      <Flex
        direction="row"
        justifyContent="space-between"
        border="1px solid grey"
        alignItems="center"
        padding="15px"
      >
        <Text>Add a new rule to {selectedTab.slice(0, -4)}</Text>
        <FormModalTrigger
          triggerButtonIcon={<CirclePlus />}
          triggerButtonText="Add Rule"
          title={`Add a new rule to ${selectedTab.slice(0, -4)}`}
          formId={ADD_RULE_FORM_ID}
          confirmButtonText="Save"
        >
          <RuleForm
            formId={ADD_RULE_FORM_ID}
            setIsLoading={setIsLoading}
            valueType={valueDef.type}
            // defaultValue={valueDef.initial}
            envName={selectedTab.slice(0, -4)}
            featureFlagId={featureFlagId}
          />
        </FormModalTrigger>
      </Flex>
    </Tabs.Root>
  );
}
