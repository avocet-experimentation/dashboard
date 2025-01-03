import { Box, Heading, Stack, Flex, Text, Highlight } from '@chakra-ui/react';
import { Environment, FeatureFlag } from '@avocet/core';
import { VALUE_FONT } from '#/lib/constants';
import { Switch } from '#/components/ui/switch';

interface FlagEnvironmentTogglesProps {
  environments: Environment[] | undefined;
  featureFlag: FeatureFlag;
  handleEnvToggleChange: (envName: string, checked: boolean) => Promise<void>;
}
export function FlagEnvironmentToggles({
  environments,
  featureFlag,
  handleEnvToggleChange,
}: FlagEnvironmentTogglesProps) {
  return (
    <Box>
      <Heading size="xl" marginBottom="15px">
        Enabled Environments
      </Heading>
      <Stack padding="15px" bg="avocet-section" borderRadius="5px">
        <Flex>
          <Text>
            <Highlight
              query={['null']}
              styles={{ color: 'red', fontFamily: VALUE_FONT }}
            >
              Flags always evaluate to null in environments in which they are
              disabled. The default value and override rules will be ignored.
            </Highlight>
          </Text>
        </Flex>
        <Flex direction="row">
          {environments &&
            environments.map((env) => (
              <Flex
                position="relative"
                margin="0 15px 0 0"
                key={`${env.name}-switch`}
              >
                <Text marginRight="5px">{env.name}:</Text>
                <Switch
                  checked={env.name in featureFlag.environmentNames}
                  onCheckedChange={async ({ checked }) =>
                    handleEnvToggleChange(env.name, checked)
                  }
                />
              </Flex>
            ))}
        </Flex>
      </Stack>
    </Box>
  );
}
