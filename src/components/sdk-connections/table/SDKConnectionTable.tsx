import { Environment, SDKConnection } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import SDKConnectionTableRow from './SDKConnectionTableRow';
import { ALL_SDK_CONNECTIONS } from '#/lib/sdk-connection-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '#/lib/graphql-queries';

/**
 * Table listing all SDKConnections
 */
export default function SDKConnectionTable() {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['allSDKConnections'],
    queryFn: async () => gqlRequest(ALL_SDK_CONNECTIONS, {}),
  });

  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
  });

  if (isPending) return <Loader />;
  if (isError) return <ErrorBox error={error} />;

  const sdkConnections: SDKConnection[] = data;
  const environments: Environment[] = environmentsQuery.data ?? [];

  if (sdkConnections.length === 0)
    return <Text>No connections found. Please create one.</Text>;

  if (environmentsQuery.isError)
    return <ErrorBox error={environmentsQuery.error} />;

  return (
    <div>
      {sdkConnections.length && (
        <Table.Root className="table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Environment</Table.ColumnHeader>
              <Table.ColumnHeader>Allowed origins</Table.ColumnHeader>
              <Table.ColumnHeader>Last updated</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sdkConnections.map((sdkConnection: SDKConnection) => (
              <SDKConnectionTableRow
                key={sdkConnection.id}
                sdkConnection={sdkConnection}
                environment={environments.find(
                  (env) => env.id === sdkConnection.environmentId,
                )}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
