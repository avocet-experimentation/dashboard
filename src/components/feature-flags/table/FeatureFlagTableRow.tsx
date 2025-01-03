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
  const { mutate } = useMutation({
    mutationKey: ['allFeatureFlags'],
    mutationFn: async (partialEntry: Partial<FeatureFlag>) =>
      gqlRequest(UPDATE_FEATURE_FLAG, {
        partialEntry: { ...partialEntry, id: flag.id },
      }),
  });

  const handleCheckedChange = async (envName: string, checked: boolean) => {
    try {
      const updatedFlag = structuredClone(flag);
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

  const { type, initial } = flag.value;
  const displayedInitialValue =
    type === 'string' ? `"${initial}"` : String(initial);

  return (
    <Table.Row key={flag.id} bg="avocet-section">
      <Table.Cell textDecor="none">
        <Link href={`/features/${flag.id}`}>
          <Text _hover={{ textDecor: 'underline' }}>{flag.name}</Text>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Tooltip showArrow openDelay={50} content={flag.value.type}>
          <Text
            width="fit-content"
            fontFamily="'Lucida Console', 'Courier New', monospace"
          >
            {displayedInitialValue}
          </Text>
        </Tooltip>
      </Table.Cell>
      {allEnvironmentNames.map((envName: string) => (
        <Table.Cell key={envName}>
          <Switch
            checked={!!flag.environmentNames[envName]}
            onCheckedChange={(e) => handleCheckedChange(envName, e.checked)}
          />
        </Table.Cell>
      ))}
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(flag.updatedAt))}
        >
          <Text width="fit-content">{lastUpdated(Number(flag.updatedAt))}</Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
