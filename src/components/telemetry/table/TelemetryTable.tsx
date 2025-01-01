import { TransformedSpan } from '@avocet/core';
import { Table } from '@chakra-ui/react';
import TelemetryTableRow from './TelemetryTableRow';
import { useAllTelemetry } from '#/hooks/query-hooks';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';

const allHeaders: (keyof TransformedSpan)[] = [
  'name',
  'attributes',
  'traceId',
  'spanId',
  'parentSpanId',
  'startTimeUnixNano',
  'endTimeUnixNano',
  'kind',
];

/**
 * Table listing all telemetry data
 * todo:
 * - transform data for legibility
 * - eliminate unwanted fields
 * - allow sorting by column values?
 */
export default function TelemetryTable() {
  const { isPending, isError, error, data: spans } = useAllTelemetry();

  if (isPending) return <Loader label="fetching telemetry data..." />;
  if (isError) return <ErrorBox error={error} />;
  if (!spans) return <ErrorBox error={new Error('No telemetry data found.')} />;

  return (
    <div>
      {spans.length && (
        <Table.Root className="table">
          <Table.Header>
            <Table.Row>
              {allHeaders.map((header) => (
                <Table.ColumnHeader key={header}>{header}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {spans.map((span: TransformedSpan) => (
              <TelemetryTableRow
                key={span.spanId}
                span={span}
                allHeaders={allHeaders}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
