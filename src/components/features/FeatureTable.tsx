import { useEffect, useState } from "react";
import { Table } from "@chakra-ui/react";
import { Switch } from "../ui/switch";
import { FeatureFlag } from "@fflags/types";
import FeatureService from "#/services/FeatureService";

interface FlagTableProps {
  data: FeatureFlag[];
}

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

const featureService = new FeatureService();

export default function FeatureTable() {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const allFeatures = await featureService.getAllFeatures();
        setFeatures(allFeatures ? allFeatures : []);
      } catch (error) {
        console.log(error);
      }
    };

    return () => handleGetAllFeatures();
  }, []);

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
        {features &&
          features.map((datum: FeatureFlag) => (
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
