import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import SDKConnectionManagementModal from '../management-form/SDKConnectionManagementModal';

interface EnvironmentTableRowProps {
  environment: Environment;
  updateEnvironment: (updated: Environment) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SDKConnectionTableRow({
  environment,
  updateEnvironment,
  setIsLoading,
}: EnvironmentTableRowProps) {
  const { environment: environmentService } = useContext(ServicesContext);
  const handleCheckedChange = (checked: boolean) => {
    environmentService.update(environment.id, {
      defaultEnabled: checked,
    });

    updateEnvironment({ ...environment, defaultEnabled: checked });
  };

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <SDKConnectionManagementModal
          setIsLoading={setIsLoading}
          sdkConnection={environment}
          updateSDKConnection={updateEnvironment}
        />
      </Table.Cell>
      <Table.Cell key={environment.name}>
        <Switch
          checked={environment.defaultEnabled}
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(environment.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(environment.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
