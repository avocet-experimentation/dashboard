import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import EnvironmentManagementModal from '../management-form/EnvironmentManagementModal';
import { useUpdateEnvironment } from '#/hooks/update-hooks';

interface EnvironmentTableRowProps {
  environment: Environment;
}

export default function EnvironmentTableRow({
  environment,
}: {
  environment: Environment;
}) {
  const { mutate, isPending } = useUpdateEnvironment(environment.id);

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
