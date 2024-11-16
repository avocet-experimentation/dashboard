// components
import { Table, Text } from "@chakra-ui/react";
import { Switch } from "../ui/switch";
import { Tooltip } from "../ui/tooltip";

// library
import { lastUpdated, formatDate } from "#/lib/timeFunctions";

// types
import { FeatureTableProps } from "#/lib/featureTypes";
import { EnvironmentName, FeatureFlag } from "@estuary/types";

// util
import { Link } from "wouter";
import { FC, useEffect, useState } from "react";
import FeatureService from "#/services/FeatureService";

const featureService = new FeatureService();

const FeatureTable: FC<FeatureTableProps> = ({ features }) => {
  const [environmentToggles, setEnvironmentToggles] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const setEnvironmentStatuses = () => {
      const environments = {};
      features.forEach((feature) => {
        const featureName = feature.name;
        environments[`${featureName}`] = {};
        Object.keys(feature.environments).forEach((envName) => {
          console.log;
          const toggle = feature["environments"][`${envName}`]["enabled"];
          environments[`${feature.name}`][envName] = toggle;
        });
      });

      setEnvironmentToggles(environments);
      console.log(environments);
      setIsLoading(false);
    };

    return () => setEnvironmentStatuses();
  }, []);

  if (features.length && !isLoading)
    return (
      <Table.Root className="table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Feature Name</Table.ColumnHeader>
            {Object.keys(features[0].environments).map((envName, i) => (
              <Table.ColumnHeader key={`${envName}-header-${i}`}>
                {envName.charAt(0).toUpperCase() + envName.slice(1)}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader>Default Value</Table.ColumnHeader>
            <Table.ColumnHeader>Override Rules</Table.ColumnHeader>
            <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {features.map((feature: FeatureFlag) => (
            <Table.Row key={feature.id}>
              <Table.Cell color="black" textDecor="none">
                <Link href={`/features/${feature.id}`}>{feature.name}</Link>
              </Table.Cell>
              {Object.keys(environmentToggles[`${feature.name}`]).map(
                (envName: EnvironmentName) => {
                  const environment = feature.environments[`${envName}`];
                  return (
                    <Table.Cell>
                      <Switch
                        checked={
                          environmentToggles[`${feature.name}`][`${envName}`]
                        }
                        onCheckedChange={({ checked }) => {
                          featureService.toggleEnvironment(
                            feature.id,
                            environment,
                            checked
                          );
                          setEnvironmentToggles((prevState) => ({
                            ...prevState,
                            [`${feature.name}`]: {
                              ...prevState[`${feature.name}`],
                              [`${envName}`]: checked,
                            },
                          }));
                        }}
                      />
                    </Table.Cell>
                  );
                }
              )}
              <Table.Cell>
                <Tooltip showArrow openDelay={50} content={feature.value.type}>
                  <Text
                    width="fit-content"
                    fontFamily="'Lucida Console', 'Courier New', monospace"
                  >
                    {String(feature.value.initial)}
                  </Text>
                </Tooltip>
              </Table.Cell>
              <Table.Cell>{}</Table.Cell>
              <Table.Cell>
                <Tooltip
                  showArrow
                  openDelay={50}
                  content={formatDate(Number(feature.updatedAt))}
                >
                  <Text width="fit-content">
                    {lastUpdated(Number(feature.updatedAt))}
                  </Text>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
};

export default FeatureTable;
