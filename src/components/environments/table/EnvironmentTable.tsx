import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import EnvironmentTableRow from './EnvironmentTableRow';
import { useQuery } from '@apollo/client';
import { GET_ENVIRONMENTS } from '#/lib/graphql';
import Loader from '#/components/helpers/Loader';

export interface EnvironmentTableProps {
  environments: Environment[];
  updateEnvironment: (updated: Environment) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Table listing all Environments
 */
export default function EnvironmentTable({
  updateEnvironment,
  setIsLoading,
}: EnvironmentTableProps) {
  const { loading, error, data } = useQuery(GET_ENVIRONMENTS);

  if (loading) return <Loader />;

  if (error) return <Text>Error: {error.message}</Text>;

  const environments = data.allEnvironments;

  return (
    <div>
      {environments.length && (
        <Table.Root className="table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Enabled by Default</Table.ColumnHeader>
              <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {environments.map((env: Environment) => (
              <EnvironmentTableRow
                key={env.id}
                environment={env}
                setIsLoading={setIsLoading}
                updateEnvironment={updateEnvironment}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
