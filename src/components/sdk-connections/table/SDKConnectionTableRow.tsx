import { Environment, SDKConnection } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { Tooltip } from '../../ui/tooltip';
import SDKConnectionManagementModal from '../management-form/SDKConnectionManagementModal';
import ErrorBox from '#/components/helpers/ErrorBox';

interface SDKConnectionTableRowProps {
  sdkConnection: SDKConnection;
  environment: Environment | undefined;
}

export default function SDKConnectionTableRow({
  sdkConnection,
  environment,
}: SDKConnectionTableRowProps) {
  if (environment === undefined) {
    const envError = new Error(
      `Environment not found for SDK Connection "${sdkConnection.name}"`,
    );
    return <ErrorBox error={envError} />;
  }

  return (
    <Table.Row bg="avocet-section">
      <Table.Cell color="black" textDecor="none">
        <SDKConnectionManagementModal sdkConnection={sdkConnection} />
      </Table.Cell>
      <Table.Cell key={sdkConnection.name}>
        <Text width="fit-content">{environment.name}</Text>
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
