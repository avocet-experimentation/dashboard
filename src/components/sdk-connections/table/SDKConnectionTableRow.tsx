import { SDKConnection } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import SDKConnectionManagementModal from '../management-form/SDKConnectionManagementModal';
import { useEnvironmentContext } from '#/lib/EnvironmentContext';

interface SDKConnectionTableRowProps {
  sdkConnection: SDKConnection;
  updateSDKConnection: (updated: SDKConnection) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SDKConnectionTableRow({
  sdkConnection,
  updateSDKConnection,
  setIsLoading,
}: SDKConnectionTableRowProps) {
  const { sdkConnection: sdkConnectionService } = useContext(ServicesContext);
  const { environments } = useEnvironmentContext();

  const currentEnv = environments.find(
    (env) => env.id === sdkConnection.environmentId,
  );

  if (currentEnv === undefined) return <></>;

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
        <Text width="fit-content">{currentEnv.name}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text width="fit-content">
          {sdkConnection.allowedOrigins.join('\n')}
        </Text>
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
