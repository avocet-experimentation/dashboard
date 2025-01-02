import { Box, Flex, Stack, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FeatureFlag } from '@avocet/core';
import ForcedValueStub from './override-rules/ForcedValueStub';
import ExperimentReferenceStub from './override-rules/ExperimentReferenceStub';
import RuleCreationModal from './override-rules/RuleCreationModal';

interface EnvironmentTabsProps {
  featureFlag: FeatureFlag;
}

export default function EnvironmentTabs({ featureFlag }: EnvironmentTabsProps) {
  const [selectedTab, setSelectedTab] = useState<string>();
  const envNames = useMemo(
    () => Object.keys(featureFlag.environmentNames),
    [featureFlag.environmentNames],
  );

  useEffect(() => {
    setSelectedTab(`${envNames[0]}-tab`);
  }, [envNames]);

  if (envNames.length === 0)
    return (
      <Box>
        <Text>
          Enable this flag in an environment to start adding override rules.
        </Text>
      </Box>
    );

  return (
    <Box id="flag-environment-tabs">
      <Text>
        Add powerful logic on top of your feature. The first matching rule
        applies and overrides the default value.
      </Text>
      <Tabs.Root
        value={selectedTab}
        margin="15px 0 0 0"
        variant="outline"
        onValueChange={(e) => setSelectedTab(e.value)}
      >
        <Tabs.List>
          {envNames.map((envName) => {
            const rules = featureFlag.overrideRules.filter(
              (rule) => rule.environmentName === envName,
            );
            return (
              <Tabs.Trigger
                border="1px solid"
                borderColor="gray.200"
                defaultValue={`${envNames[0]}-tab`}
                value={`${envName}-tab`}
                key={`${envName}-tab`}
              >
                {`${envName} (${rules.length})`}
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
                border="1px solid"
                borderColor="gray.200"
                value={`${envName}-tab`}
                key={`${envName}-tab-content`}
                background="whitesmoke"
                padding="15px"
              >
                <Stack gap={4}>
                  {!rules.length
                    ? 'There are no rules for this environment yet.'
                    : rules.map((rule) => {
                        if (rule.type === 'ForcedValue') {
                          return <ForcedValueStub rule={rule} key={rule.id} />;
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
                </Stack>
              </Tabs.Content>
            );
          })}
        </Tabs.ContentGroup>
        {selectedTab && (
          <Flex
            direction="row"
            justifyContent="space-between"
            border="1px solid grey"
            borderBottomRadius="5px"
            borderTopColor="gray.300"
            alignItems="center"
            padding="15px"
          >
            <Text>{`Add a new rule to ${selectedTab.slice(0, -4)}`}</Text>
            <RuleCreationModal
              featureFlag={featureFlag}
              environmentName={selectedTab.slice(0, -4)}
            />
          </Flex>
        )}
      </Tabs.Root>
    </Box>
  );
}
