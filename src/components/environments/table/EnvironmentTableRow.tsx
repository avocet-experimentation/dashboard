import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import EnvironmentManagementModal from '../management-form/EnvironmentManagementModal';
import { UPDATE_ENVIRONMENT } from '#/lib/environment-queries';
import { gqlRequest } from '#/lib/graphql-queries';
import { useMutation } from '@tanstack/react-query';

interface EnvironmentTableRowProps {
  environment: Environment;
}

export default function EnvironmentTableRow({
  environment,
}: EnvironmentTableRowProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (updates: Partial<Omit<Environment, 'id'>>) =>
      gqlRequest(UPDATE_ENVIRONMENT, {
        partialEntry: { id: environment.id, ...updates },
      }),
    mutationKey: ['allEnvironments'],
  });

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <EnvironmentManagementModal environment={environment} />
      </Table.Cell>
      <Table.Cell key={environment.name}>
        <Switch
          checked={environment.defaultEnabled}
          onCheckedChange={(e) => mutate({ defaultEnabled: e.checked })}
          disabled={isPending}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(environment.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(environment.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
