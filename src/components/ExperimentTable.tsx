import { useState } from "react";
import { Table } from "@chakra-ui/react";
import { Switch } from "./ui/switch";

// interface FlagTableProps {
//   data: FeatureFlag[];
// }

const handleEnvironmentSwitch = async (fflagId: string): Promise<void> => {
  try {
    const res = await fetch(`http://localhost:3524/admin/fflag/${fflagId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default function FlagTable({ data }) {
  const [experiments, setExperiments] = useState(data);
  return (
    <Table.Root className="table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Experiment Name</Table.ColumnHeader>
          <Table.ColumnHeader>Feature Name</Table.ColumnHeader>
          <Table.ColumnHeader>Override Rules</Table.ColumnHeader>
          <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {experiments &&
          experiments.map((datum) => (
            <Table.Row key={datum.id}>
              <Table.Cell>{datum.name}</Table.Cell>
              <Table.Cell>{datum.defaultValue}</Table.Cell>
              <Table.Cell>TBD</Table.Cell>
              <Table.Cell>{datum.updatedAt}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
}
