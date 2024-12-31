// components
import { Table } from '@chakra-ui/react';
import { Status } from '../../ui/status';

// library
import { formatDate } from '#/lib/timeFunctions';
import { EXP_STATUS_LEGEND } from '#/lib/constants';

// util
import { Link } from 'wouter';
import { Tooltip } from '../../ui/tooltip';
import { ALL_EXPERIMENTS } from '#/lib/experiment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '#/lib/graphql-queries';

export default function ExperimentTable() {
  const experimentsQuery = useQuery({
    queryKey: ['allExperiments'],
    queryFn: async () => gqlRequest(ALL_EXPERIMENTS, {}),
  });

  if (experimentsQuery.isPending) return <Loader />;

  if (experimentsQuery.isError)
    return <ErrorBox error={experimentsQuery.error} />;

  const { allExperiments } = experimentsQuery.data;

  if (allExperiments.length === 0)
    return (
      <ErrorBox error={new Error('No experiments found. Please create one.')} />
    );

  return (
    <Table.Root className="table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Experiment Name</Table.ColumnHeader>
          <Table.ColumnHeader>Environment</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Date Created</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {allExperiments.map((exp) => (
          <Table.Row key={exp.id}>
            <Table.Cell>
              <Link href={`/experiments/${exp.id}`}>{exp.name}</Link>
            </Table.Cell>
            <Table.Cell>{exp.environmentName}</Table.Cell>
            <Table.Cell>
              <Tooltip
                showArrow
                openDelay={50}
                content={EXP_STATUS_LEGEND[exp.status].description}
              >
                <Status colorPalette={EXP_STATUS_LEGEND[exp.status].color}>
                  {exp.status}
                </Status>
              </Tooltip>
            </Table.Cell>
            <Table.Cell>{formatDate(exp.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
