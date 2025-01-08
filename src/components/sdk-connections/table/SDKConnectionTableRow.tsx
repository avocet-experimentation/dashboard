import { Environment, SDKConnection } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { Tooltip } from '../../ui/tooltip';
import SDKConnectionManagementModal from '../management-form/SDKConnectionManagementModal';
import {
  ElementListItem,
  ElementListRoot,
} from '#/components/helpers/ElementList';

interface SDKConnectionTableRowProps {
  sdkConnection: SDKConnection;
  environment: Environment | undefined;
}

export default function SDKConnectionTableRow({
  sdkConnection,
  environment,
}: SDKConnectionTableRowProps) {
  return (
    <Table.Row bg="avocet-section">
      <Table.Cell color="black" textDecor="none">
        <SDKConnectionManagementModal sdkConnection={sdkConnection} />
      </Table.Cell>
      <Table.Cell key={sdkConnection.name}>
        <Text width="fit-content">
          {environment?.name ?? '(No environment set)'}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <Text width="fit-content">
          {sdkConnection.allowedOrigins.length ? (
            <ElementListRoot>
              {sdkConnection.allowedOrigins.map((origin) => (
                <ElementListItem key={origin}>
                  <Text>{origin}</Text>
                </ElementListItem>
              ))}
            </ElementListRoot>
          ) : undefined}
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
