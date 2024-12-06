import { Flex, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FeatureFlag } from '@estuary/types';
import ForcedValueStub from './override-rules/ForcedValueStub';
import ExperimentReferenceStub from './override-rules/ExperimentReferenceStub';
import RuleCreationModal from './override-rules/RuleCreationModal';

interface EnvironmentTabsProps {
  featureFlag: FeatureFlag;
}

export default function EnvironmentTabs({ featureFlag }: EnvironmentTabsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // todo: fetch or pass in environment objects to list all environment names
  // set to show in toggle list and rest in something like an overflow dropdown
  const [envNames, setEnvNames] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>();

  useEffect(() => {
    setEnvNames(Object.keys(featureFlag.environmentNames));
  }, [featureFlag]);

  useEffect(() => {
    setSelectedTab(`${envNames[0]}-tab`);
  }, [envNames]);

  return (
    <div id="flag-environment-tabs">
      {envNames.length ? (
        <>
          <Text>
            Add powerful logic on top of your feature. The first matching rule
            applies and overrides the default value.
          </Text>
          <Tabs.Root
            value={selectedTab}
            margin="15px 0 0 0"
            variant="plain"
            onValueChange={(e) => setSelectedTab(e.value)}
          >
            <Tabs.List>
              {envNames.map((envName) => {
                const rules = featureFlag.overrideRules.filter(
                  (rule) => rule.environmentName === envName,
                );
                return (
                  <Tabs.Trigger
                    defaultValue={`${envNames[0]}-tab`}
                    value={`${envName}-tab`}
                    key={`${envName}-tab`}
                  >
                    {`${envName} ${rules.length}`}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>
            <Tabs.ContentGroup>
              {envNames.map((envName) => {
                const rules = featureFlag.overrideRules.filter(
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
                            return (
                              <ForcedValueStub rule={rule} key={rule.id} />
                            );
                          }
                          if (rule.type === 'Experiment') {
                            return (
                              <ExperimentReferenceStub
                                rule={rule}
                                key={rule.id}
                              />
                            );
                          }
                          throw new TypeError(`Rule ${rule} is not handled!`);
                        })}
                  </Tabs.Content>
                );
              })}
            </Tabs.ContentGroup>
            {selectedTab && (
              <Flex
                direction="row"
                justifyContent="space-between"
                border="1px solid grey"
                alignItems="center"
                padding="15px"
              >
                <Text>{`Add a new rule to ${selectedTab.slice(0, -4)}`}</Text>
                <RuleCreationModal
                  setIsLoading={setIsLoading}
                  featureFlag={featureFlag}
                  environmentName={selectedTab.slice(0, -4)}
                />
              </Flex>
            )}
          </Tabs.Root>
        </>
      ) : (
        'Enable this flag in an environment to start adding override rules.'
      )}
    </div>
  );
}
