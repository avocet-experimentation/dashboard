import { Event, Span } from '#/lib/types';
import { Box } from '@chakra-ui/react'

export default function EventList({ data }: { data: Span[] }) {
  const downloadJson = (datum: Event) => {
    const json = JSON.stringify(datum);
    const blob = new Blob([json], {type: 'application/json'});

    return URL.createObjectURL(blob);
  }

  return (
    <Box overflowY="scroll" height={700}>
      <ul>
      {data.map((datum, i) => 
        <li key={i}>
          <a href={downloadJson(datum)}>{datum.spanid}: {datum.spanattributes['cassandra.partition_key']}: {datum.timestamp}</a>
        </li>)}
      </ul>
    </Box>
  );
}


