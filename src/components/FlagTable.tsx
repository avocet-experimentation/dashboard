import { useState } from "react";
import { Table } from "@chakra-ui/react";
import { Switch } from "./ui/switch";
import { FeatureFlag } from "@fflags/types";

interface FlagTableProps {
  data: FeatureFlag[];
}

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

export default function FlagTable({ data }: FlagTableProps) {
  const [flags, setFlags] = useState(data);
  return (
    <Table.Root className="table" >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Feature Name</Table.ColumnHeader>
          <Table.ColumnHeader>Dev</Table.ColumnHeader>
          <Table.ColumnHeader>Prod</Table.ColumnHeader>
          <Table.ColumnHeader>Testing</Table.ColumnHeader>
          <Table.ColumnHeader>Default Value</Table.ColumnHeader>
          <Table.ColumnHeader>Override Rules</Table.ColumnHeader>
          <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {flags &&
          flags.map((datum: FeatureFlag) => (
            <Table.Row key={datum.id}>
              <Table.Cell>{datum.name}</Table.Cell>
              <Table.Cell>
                <Switch
                  checked={datum.environments.dev.enabled}
                  onCheckedChange={() => handleEnvironmentSwitch(datum.id)}
                />
              </Table.Cell>
              <Table.Cell>
                <Switch checked={datum.environments.prod.enabled} />
              </Table.Cell>
              <Table.Cell>
                <Switch checked={datum.environments.testing.enabled} />
              </Table.Cell>
              <Table.Cell>{datum.defaultValue}</Table.Cell>
              <Table.Cell>TBD</Table.Cell>
              <Table.Cell>{datum.updatedAt}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
}
