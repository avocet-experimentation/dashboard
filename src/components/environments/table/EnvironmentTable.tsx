import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import EnvironmentTableRow from './EnvironmentTableRow';
import { useQuery } from '@tanstack/react-query';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { GET_ENVIRONMENTS } from '#/lib/environmentQueries';
import request from 'graphql-request';

export interface EnvironmentTableProps {
  // environments: Environment[];
  // updateEnvironment: (updated: Environment) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Table listing all Environments
 */
export default function EnvironmentTable({
  // updateEnvironment,
  setIsLoading,
}: EnvironmentTableProps) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['getEnvironments'],
    queryFn: async () =>
      request({
        url: import.meta.env.VITE_GRAPHQL_SERVICE_URL,
        document: GET_ENVIRONMENTS,
        variables: {},
      }),
  });

  if (isPending) return <Loader />;

  if (isError) return <ErrorBox error={error} />;

  const environments = data.allEnvironments;

  // if (environments.length === 0) return <Text>No environments found.</Text>;

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
          {environments.map((env: Environment) => (
            <EnvironmentTableRow
              key={env.id}
              environment={env}
              setIsLoading={setIsLoading}
              // updateEnvironment={updateEnvironment}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
