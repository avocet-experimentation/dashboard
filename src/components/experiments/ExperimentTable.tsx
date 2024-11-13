import { Table } from "@chakra-ui/react";
import { formatDate } from "#/lib/timeFunctions";
import { Experiment } from "@estuary/types";

const ExperimentTable = ({ experiments }) => {
  return (
    <Table.Root className="table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Experiment Name</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Date Created</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {experiments &&
          experiments.map((exp: Experiment) => (
            <Table.Row key={exp.id}>
              <Table.Cell>{exp.name}</Table.Cell>
              <Table.Cell>{exp.status}</Table.Cell>
              <Table.Cell>{formatDate(exp.startTimestamp)}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ExperimentTable;
