// components
import { Table } from '@chakra-ui/react';
import { Status } from '../../ui/status';

// library
import { formatDate } from '#/lib/timeFunctions';

// types
import { Experiment } from '@avocet/core';

// util
import { Link } from 'wouter';
import { Tooltip } from '../../ui/tooltip';

const statusLegend = {
  draft: {
    color: 'yellow',
    description: 'This experiment is still being configured.',
  },
  active: { color: 'green', description: 'This experiment is in progress.' },
  paused: {
    color: 'red',
    description: 'This experiment is currently not running.',
  },
  completed: {
    color: 'blue',
    description: 'This experiment has reached its end.',
  },
};

const ExperimentTable = ({ experiments }: { experiments: Experiment[] }) => {
  console.table(experiments);
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
        {experiments &&
          experiments.map((exp: Experiment) => (
            <Table.Row key={exp.id}>
              <Table.Cell>
                <Link href={`/experiments/${exp.id}`}>{exp.name}</Link>
              </Table.Cell>
              <Table.Cell>{exp.environmentName}</Table.Cell>
              <Table.Cell>
                <Tooltip
                  showArrow
                  openDelay={50}
                  content={statusLegend[exp.status].description}
                >
                  <Status colorPalette={statusLegend[exp.status].color}>
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
};

export default ExperimentTable;
