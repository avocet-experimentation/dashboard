// components
import { Table, Text } from '@chakra-ui/react';
import { Switch } from '../ui/switch';
import { Tooltip } from '../ui/tooltip';

// library
import { lastUpdated, formatDate } from '#/lib/timeFunctions';

// types
import { FeatureFlag } from '@estuary/types';

// util
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import FeatureService from '#/services/FeatureService';
import merge from 'deepmerge';

const featureService = new FeatureService();

type AllEnvironmentToggles = Record<string, FeatureFlag['environmentNames']>;
export interface FeatureTableProps {
  featureFlags: FeatureFlag[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeatureTable({
  featureFlags,
  isLoading,
  setIsLoading,
}: FeatureTableProps) {
  const [environmentToggles, setEnvironmentToggles] =
    useState<AllEnvironmentToggles>({});
  const [allEnvironmentNames, setAllEnvironmentNames] = useState<string[]>([]);

  useEffect(() => {
    const setEnvironmentStatuses = async () => {
      // todo: replace with map/list of names of all fetched environments
      const environments: AllEnvironmentToggles = {};

      featureFlags.forEach((flag) => {
        environments[flag.name] = flag.environmentNames;

        setAllEnvironmentNames((prevState) =>
          [
            ...new Set([...prevState, ...Object.keys(flag.environmentNames)]),
          ].toSorted(),
        );
      });

      setEnvironmentToggles(environments);
      setIsLoading(false);
    };

    setEnvironmentStatuses();
  }, []);

  // console.table(featureFlags);

  return (
    <>
      {featureFlags.length && !isLoading && (
        <Table.Root className="table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Feature Name</Table.ColumnHeader>
              {[...allEnvironmentNames].map((envName, i) => (
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
            {featureFlags.map((flag: FeatureFlag) => {
              return (
                <FeatureFlagTableRow
                  key={flag.id}
                  environmentToggles={environmentToggles}
                  allEnvironmentNames={[...allEnvironmentNames]}
                  flag={flag}
                  setEnvironmentToggles={setEnvironmentToggles}
                />
              );
            })}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
}

interface FeatureFlagTableRowProps {
  environmentToggles: AllEnvironmentToggles;
  allEnvironmentNames: string[];
  flag: FeatureFlag;
  setEnvironmentToggles: React.Dispatch<
    React.SetStateAction<AllEnvironmentToggles>
  >;
}

function FeatureFlagTableRow({
  environmentToggles,
  allEnvironmentNames,
  flag,
  setEnvironmentToggles,
}: FeatureFlagTableRowProps) {
  // todo: remove this placeholder guard clause
  if (!(flag.name in environmentToggles)) {
    throw new Error(
      `No flag with the specified name ${flag.name} was present in 'environmentToggles'! `,
    );
  }

  // impute missing environment names with `false`
  const [envStatuses, setEnvStatuses] = useState<Record<string, boolean>>(
    allEnvironmentNames.reduce(
      (acc, envName) =>
        Object.assign(acc, { [envName]: envName in flag.environmentNames }),
      {},
    ),
  );

  const toggleEnvironmentDisplay = (envName: string) => {
    setEnvStatuses((prevState) => ({
      ...prevState,
      [envName]: !prevState[envName],
    }));
  };

  const handleCheckedChange = (envName: string, checked: boolean) => {
    featureService.toggleEnvironment(flag.id, envName);

    setEnvironmentToggles((prevState) => {
      if (checked) {
        const update = {
          [flag.name]: { [envName]: true as const },
        };
        return merge(prevState, update);
      } else {
        delete prevState[flag.name][envName];
        return prevState;
      }
    });

    toggleEnvironmentDisplay(envName);
  };

  return (
    <Table.Row key={flag.id}>
      <Table.Cell color="black" textDecor="none">
        <Link href={`/features/${flag.id}`}>{flag.name}</Link>
      </Table.Cell>
      {allEnvironmentNames.map((envName: string) => (
        <Table.Cell key={envName}>
          <Switch
            checked={envStatuses[envName]}
            onCheckedChange={(e) => handleCheckedChange(envName, e.checked)}
          />
        </Table.Cell>
      ))}
      <Table.Cell>
        <Tooltip showArrow openDelay={50} content={flag.value.type}>
          <Text
            width="fit-content"
            fontFamily="'Lucida Console', 'Courier New', monospace"
          >
            {String(flag.value.initial)}
          </Text>
        </Tooltip>
      </Table.Cell>
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(flag.updatedAt))}
        >
          <Text width="fit-content">{lastUpdated(Number(flag.updatedAt))}</Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
