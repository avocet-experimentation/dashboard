import { Table, Text } from "@chakra-ui/react";
import { Switch } from "../ui/switch";
import { FeatureFlag } from "@estuary/types";
import { Link } from "wouter";
import { Tooltip } from "../ui/tooltip";
import { lastUpdated, formatDate } from "#/lib/timeFunctions";

const handleEnvironmentSwitch = async (fflagId: string): Promise<void> => {
  // try {
  //   const res = await fetch(`http://localhost:3524/admin/fflag/${fflagId}`, {
  //     method: "PATCH",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
};

const FeatureTable = ({ features }) => {
  return (
    <Table.Root className="table">
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
        {features.length
          ? features.map((feature: FeatureFlag) => (
              <Table.Row key={feature.id}>
                <Table.Cell color="black" textDecor="none">
                  <Link href={`/features/${feature.id}`}>{feature.name}</Link>
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    checked={feature.environments.dev.enabled}
                    onCheckedChange={() => handleEnvironmentSwitch(feature.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Switch checked={feature.environments.prod.enabled} />
                </Table.Cell>
                <Table.Cell>
                  <Switch checked={feature.environments.testing.enabled} />
                </Table.Cell>
                <Table.Cell>
                  <Tooltip showArrow content={feature.value.type}>
                    <Text
                      width="fit-content"
                      fontFamily="'Lucida Console', 'Courier New', monospace"
                    >
                      {String(feature.value.default)}
                    </Text>
                  </Tooltip>
                </Table.Cell>
                <Table.Cell>{}</Table.Cell>
                <Table.Cell>
                  <Tooltip
                    showArrow
                    content={formatDate(Number(feature.updatedAt))}
                  >
                    <Text width="fit-content">
                      {lastUpdated(Number(feature.updatedAt))}
                    </Text>
                  </Tooltip>
                </Table.Cell>
              </Table.Row>
            ))
          : null}
      </Table.Body>
    </Table.Root>
  );
};

export default FeatureTable;
