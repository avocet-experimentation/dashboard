import { useState } from 'react';

// module components
import { Table, Text } from '@chakra-ui/react';
import { FeatureFlag, FeatureFlagDraft, featureFlagSchema } from '@avocet/core';
import { Link } from 'wouter';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';

// local components
import { Switch } from '#/components/ui/switch';
import { Tooltip } from '#/components/ui/tooltip';
import { UPDATE_FEATURE_FLAG, gqlRequest } from '#/lib/graphql-queries';
import { useMutation } from '@tanstack/react-query';

interface FeatureFlagTableRowProps {
  allEnvironmentNames: string[];
  flag: FeatureFlag;
}

export default function FeatureFlagTableRow({
  allEnvironmentNames,
  flag,
}: FeatureFlagTableRowProps) {
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag>(flag);
  const { mutate } = useMutation({
    mutationKey: ['allFeatureFlags'],
    mutationFn: async (partialEntry: Partial<FeatureFlag>) =>
      gqlRequest(UPDATE_FEATURE_FLAG, {
        partialEntry: { ...partialEntry, id: flag.id },
      }),
    onSuccess: (data) => {
      const updated = data.updateFeatureFlag;
      if (updated !== null) setFeatureFlag(featureFlagSchema.parse(updated));
    },
  });

  const handleCheckedChange = async (envName: string, checked: boolean) => {
    try {
      const updatedFlag = structuredClone(featureFlag);
      if (checked) {
        FeatureFlagDraft.enableEnvironment(updatedFlag, envName);
      } else {
        FeatureFlagDraft.disableEnvironment(updatedFlag, envName);
      }
      mutate({
        environmentNames: updatedFlag.environmentNames,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Table.Row key={featureFlag.id}>
      <Table.Cell color="black" textDecor="none">
        <Link href={`/features/${featureFlag.id}`}>{featureFlag.name}</Link>
      </Table.Cell>
      {allEnvironmentNames.map((envName: string) => (
        <Table.Cell key={envName}>
          <Switch
            checked={!!featureFlag.environmentNames[envName]}
            onCheckedChange={(e) => handleCheckedChange(envName, e.checked)}
          />
        </Table.Cell>
      ))}
      <Table.Cell>
        <Tooltip showArrow openDelay={50} content={featureFlag.value.type}>
          <Text
            width="fit-content"
            fontFamily="'Lucida Console', 'Courier New', monospace"
          >
            {String(featureFlag.value.initial)}
          </Text>
        </Tooltip>
      </Table.Cell>
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(featureFlag.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(featureFlag.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
