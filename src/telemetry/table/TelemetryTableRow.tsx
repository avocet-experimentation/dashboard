import { TransformedSpan } from '@estuary/types';
import { Stack, Table, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '#/components/ui/switch';
import { Tooltip } from '#/components/ui/tooltip';
import { TelemetryContext } from '../TelemetryContext';

interface TelemetryTableRowProps {
  span: TransformedSpan;
  allHeaders: (keyof TransformedSpan)[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TelemetryTableRow({
  span,
  allHeaders,
}: TelemetryTableRowProps) {
  const { parseAttributesToEntries, parseAttributesToMap } =
    useContext(TelemetryContext);

  const valueToDisplayLines = (header: keyof TransformedSpan): string[] => {
    if (!(header in span)) {
      throw new TypeError(
        `Header "${header}" not found in span ${JSON.stringify(span)}`,
      );
    }

    const value = span[header];
    if (value === null || value === undefined) return ['---'];

    if (typeof value === 'object') {
      if (Array.isArray(value)) return [JSON.stringify(value)];
      else {
        // return JSON.stringify(parseAttributesToMap(value));

        const formatted = parseAttributesToEntries(value).map(
          ([key, value]) => `${key}: ${value}`,
        );
        return formatted;
      }
    }

    return [String(value)];
  };

  return (
    <Table.Row>
      {allHeaders.map((header) => (
        <Table.Cell key={header}>
          <Stack>
            {valueToDisplayLines(header).map((line, i) => (
              <Text key={i} truncate maxWidth={`400px`}>
                {line}
              </Text>
            ))}
          </Stack>{' '}
        </Table.Cell>
      ))}
      {/* <Table.Cell color="black" textDecor="none">
        <EnvironmentManagementModal
          setIsLoading={setIsLoading}
          environment={event}
          updateEnvironment={updateEnvironment}
        />
      </Table.Cell>
      <Table.Cell key={event.name}>
        <Switch
          checked={event.defaultEnabled}
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(event.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(event.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell> */}
    </Table.Row>
  );
}
