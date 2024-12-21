import { Environment } from '@avocet/core';
import { Table } from '@chakra-ui/react';
import SDKConnectionTableRow from './SDKConnectionTableRow';

export interface EnvironmentTableProps {
  environments: Environment[];
  updateEnvironment: (updated: Environment) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Table listing all Environments
 */
export default function SDKConnectionTable({
  environments,
  updateEnvironment,
  setIsLoading,
}: EnvironmentTableProps) {
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
              <SDKConnectionTableRow
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
