import { Table } from '@chakra-ui/react';
import { Environment, FeatureFlag } from '@avocet/core';
import FeatureFlagTableRow from './FeatureFlagTableRow';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { ALL_FEATURE_FLAGS } from '#/lib/flag-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { useGQLQuery } from '#/lib/graphql-queries';

export default function FeatureFlagTable() {
  const flagsQuery = useGQLQuery(['allFeatureFlags'], ALL_FEATURE_FLAGS);
  const environmentsQuery = useGQLQuery(['allEnvironments'], ALL_ENVIRONMENTS);

  if (flagsQuery.isPending) return <Loader />;

  if (flagsQuery.isError) return <ErrorBox error={flagsQuery.error} />;

  const { allFeatureFlags } = flagsQuery.data;
  const featureFlags: FeatureFlag[] = allFeatureFlags as FeatureFlag[];
  let allEnvironments: Environment[] = [];

  if (environmentsQuery.isSuccess)
    allEnvironments = environmentsQuery.data.allEnvironments;
  const pinnedEnvironments = allEnvironments.filter((env) => env.pinToLists);

  if (featureFlags.length === 0)
    return (
      <ErrorBox
        error={new Error('No feature flags found. Please create one.')}
      />
    );

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
            allEnvironmentNames={pinnedEnvironments.map((env) => env.name)}
            flag={flag}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
}
