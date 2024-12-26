import { Table } from '@chakra-ui/react';
import { Environment, FeatureFlag, featureFlagSchema } from '@avocet/core';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import FeatureFlagTableRow from './FeatureFlagTableRow';
import { allFlagsQuery } from '#/lib/flag-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';

export interface FeatureFlagTableProps {
  featureFlags: FeatureFlag[];
  updateFlag: (updated: FeatureFlag) => void;
  pinnedEnvironments: Environment[];
}

export default function FeatureFlagTable({
  // featureFlags,
  updateFlag,
  pinnedEnvironments,
}: FeatureFlagTableProps) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['getFeatureFlags'],
    // queryFn: async () => execute(allFlagsQuery),
    queryFn: async () =>
      request({
        url: import.meta.env.VITE_GRAPHQL_SERVICE_URL,
        document: allFlagsQuery,
        variables: {},
      }),
  });

  if (isPending) return <Loader />;

  if (isError) return <ErrorBox error={error} />;

  const { allFeatureFlags } = data;
  const featureFlags: FeatureFlag[] = allFeatureFlags as FeatureFlag[];

  // TODO: remove this parse after resolving OverrideRule.type narrowing
  // for better type safety, use Zod schema parsing instead of `as`:
  // const featureFlags: FeatureFlag[] = featureFlagSchema
  //   .array()
  //   .parse(allFeatureFlags);

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
        {featureFlags.map((flag) => (
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
