import { useContext, useEffect } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import TelemetryTypeSelector from './TelemetryTypeSelector';
import TelemetryTable from './table/TelemetryTable';
import { TelemetryContext } from './TelemetryContext';
import { TelemetryProvider } from './TelemetryProvider';

function TelemetryMain() {
  const { spans, selectedType, getAllTelemetry, fetchSpansOfType } =
    useContext(TelemetryContext);

  useEffect(() => {
    const getSpanData = async () => {
      selectedType === null
        ? getAllTelemetry()
        : fetchSpansOfType(selectedType);
    };

    getSpanData();
  }, [selectedType]);

  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Telemetry</Heading>
        <TelemetryTypeSelector />
      </Flex>
      <Text margin="15px 0">View telemetry data here.</Text>
      {spans.length ? <TelemetryTable /> : 'No telemetry found.'}
    </Flex>
  );
}

export default function TelemetryWrapper() {
  return (
    <TelemetryProvider>
      <TelemetryMain />
    </TelemetryProvider>
  );
}
