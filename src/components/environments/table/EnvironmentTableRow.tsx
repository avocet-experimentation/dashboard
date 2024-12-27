import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import EnvironmentManagementModal from '../management-form/EnvironmentManagementModal';
import { UPDATE_ENVIRONMENT } from '#/lib/environment-queries';
import { useGQLMutation } from '#/lib/graphql-queries';

interface EnvironmentTableRowProps {
  environment: Environment;
}

export default function EnvironmentTableRow({
  environment,
}: EnvironmentTableRowProps) {
  const { mutate, isPending } = useGQLMutation({
    mutation: UPDATE_ENVIRONMENT,
    cacheKey: ['allEnvironments'],
  });

  const handleCheckedChange = (checked: boolean) => {
    mutate({ partialEntry: { id: environment.id, defaultEnabled: checked } });
  };

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <EnvironmentManagementModal environment={environment} />
      </Table.Cell>
      <Table.Cell key={environment.name}>
        <Switch
          checked={environment.defaultEnabled}
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
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
