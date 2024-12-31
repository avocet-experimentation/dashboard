import { TransformedSpan } from '@avocet/core';
import { Table } from '@chakra-ui/react';
import TelemetryTableRow from './TelemetryTableRow';
import { useContext, useState } from 'react';
import { TelemetryContext } from '../TelemetryContext';

// export interface TelemetryTableProps {
//   spans: TransformedSpan[];
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }

/**
 * Table listing all telemetry data
 * todo:
 * - transform data for legibility
 * - eliminate unwanted fields
 * - allow sorting by column values?
 */
export default function TelemetryTable() {
  const { spans, setIsLoading } = useContext(TelemetryContext);

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
                setIsLoading={setIsLoading}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
