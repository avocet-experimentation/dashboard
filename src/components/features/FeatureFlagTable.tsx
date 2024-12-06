import { Table } from '@chakra-ui/react';
import { Environment, FeatureFlag } from '@estuary/types';
import FeatureFlagTableRow from './FeatureFlagTableRow';

export interface FeatureFlagTableProps {
  featureFlags: FeatureFlag[];
  updateFlag: (updated: FeatureFlag) => void;
  pinnedEnvironments: Environment[];
}

export default function FeatureFlagTable({
  featureFlags,
  updateFlag,
  pinnedEnvironments,
}: FeatureFlagTableProps) {
  return (
    <Table.Root className="table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Feature Name</Table.ColumnHeader>
          {pinnedEnvironments.map((env) => (
            <Table.ColumnHeader key={`${env.name}-header`}>
              {env.name.charAt(0).toUpperCase() + env.name.slice(1)}
            </Table.ColumnHeader>
          ))}
          <Table.ColumnHeader>Default Value</Table.ColumnHeader>
          <Table.ColumnHeader>Override Rules</Table.ColumnHeader>
          <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {featureFlags.map((flag: FeatureFlag) => (
          <FeatureFlagTableRow
            key={flag.id}
            updateFlag={updateFlag}
            allEnvironmentNames={pinnedEnvironments.map((env) => env.name)}
            flag={flag}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
}
