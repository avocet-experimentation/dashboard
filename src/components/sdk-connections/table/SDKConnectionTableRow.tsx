import { Environment, SDKConnection } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import SDKConnectionManagementModal from '../management-form/SDKConnectionManagementModal';

interface SDKConnectionTableRowProps {
  sdkConnection: SDKConnection;
  updateSDKConnection: (updated: SDKConnection) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnvironmentTableRow({
  sdkConnection,
  updateSDKConnection,
  setIsLoading,
}: SDKConnectionTableRowProps) {
  const { sdkConnection: sdkConnectionService } = useContext(ServicesContext);
  const handleCheckedChange = (checked: boolean) => {
    sdkConnectionService.update(sdkConnection.id, {
      defaultEnabled: checked,
    });

    updateSDKConnection({ ...sdkConnection, defaultEnabled: checked }); //TODO
  };

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <SDKConnectionManagementModal
          setIsLoading={setIsLoading}
          sdkConnection={sdkConnection}
          updateSDKConnection={updateSDKConnection}
        />
      </Table.Cell>
      <Table.Cell key={sdkConnection.name}>
        <Switch
          checked={sdkConnection.defaultEnabled} //TODO
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(sdkConnection.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(sdkConnection.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
