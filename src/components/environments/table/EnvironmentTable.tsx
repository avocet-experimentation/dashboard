import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '#/lib/graphql-queries';
import { useUpdateEnvironment } from '#/hooks/update-hooks';
import { formatDate, lastUpdated } from '#/lib/timeFunctions';
import EnvironmentManagementModal from '../management-form/EnvironmentManagementModal';
import { Switch } from '#/components/ui/switch';
import { Tooltip } from '#/components/ui/tooltip';

/**
 * Table listing all Environments
 */
export default function EnvironmentTable() {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
  });

  if (isPending) return <Loader />;

  if (isError) return <ErrorBox error={error} />;

  return (
    <div>
      <Table.Root className="table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Enabled by Default</Table.ColumnHeader>
            <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((env: Environment) => (
            <EnvironmentTableRow key={env.id} environment={env} />
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
function EnvironmentTableRow({ environment }: { environment: Environment }) {
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
