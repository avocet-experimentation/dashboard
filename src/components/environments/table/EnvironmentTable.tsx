import { Environment } from '@avocet/core';
import { Table } from '@chakra-ui/react';
import EnvironmentTableRow from './EnvironmentTableRow';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { useGQLQuery } from '#/lib/graphql-queries';

/**
 * Table listing all Environments
 */
export default function EnvironmentTable() {
  const { isPending, isError, error, data } = useGQLQuery(
    ['allEnvironments'],
    ALL_ENVIRONMENTS,
  );

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
          {data.allEnvironments.map((env: Environment) => (
            <EnvironmentTableRow key={env.id} environment={env} />
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
