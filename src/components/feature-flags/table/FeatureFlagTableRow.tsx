import deepcopy from 'deepcopy';
import { useContext } from 'react';

// module components
import { Table, Text } from '@chakra-ui/react';
import { FeatureFlag, FeatureFlagDraft } from '@estuary/types';
import { Link } from 'wouter';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';

// local components
import { Switch } from '#/components/ui/switch';
import { Tooltip } from '#/components/ui/tooltip';

interface FeatureFlagTableRowProps {
  allEnvironmentNames: string[];
  flag: FeatureFlag;
  updateFlag: (updated: FeatureFlag) => void;
}

export default function FeatureFlagTableRow({
  allEnvironmentNames,
  flag,
  updateFlag,
}: FeatureFlagTableRowProps) {
  const { featureFlag: featureService } = useContext(ServicesContext);

  // todo: replace toggle invocations with enable/disable
  const handleCheckedChange = async (envName: string, checked: boolean) => {
    try {
      const response = await featureService.toggleEnvironment(flag.id, envName);
      if (!response.ok) {
        throw new Error(`Failed to update record for flag ${flag.id}`);
      }
      const updatedFlag = deepcopy(flag);
      FeatureFlagDraft.toggleEnvironment(updatedFlag, envName);

      updateFlag(updatedFlag);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Table.Row key={flag.id}>
      <Table.Cell color="black" textDecor="none">
        <Link href={`/features/${flag.id}`}>{flag.name}</Link>
      </Table.Cell>
      {allEnvironmentNames.map((envName: string) => (
        <Table.Cell key={envName}>
          <Switch
            checked={flag.environmentNames[envName]}
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
