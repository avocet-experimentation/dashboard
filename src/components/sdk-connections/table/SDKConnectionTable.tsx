import { SDKConnection } from '@avocet/core';
import { Table } from '@chakra-ui/react';
import SDKConnectionTableRow from './SDKConnectionTableRow';

export interface SDKConnectionTableProps {
  sdkConnections: SDKConnection[];
  updateSDKConnection: (updated: SDKConnection) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Table listing all SDKConnections
 */
export default function SDKConnectionTable({
  sdkConnections,
  updateSDKConnection,
  setIsLoading,
}: SDKConnectionTableProps) {
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
                setIsLoading={setIsLoading}
                updateSDKConnection={updateSDKConnection}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
