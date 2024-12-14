import { useContext, useEffect, useState } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { TransformedSpan } from '@estuary/types';
import { ServicesContext } from '#/services/ServiceContext';
import TelemetryTypeSelector from './TelemetryTypeSelector';
import TelemetryTable from './table/TelemetryTable';
import { TelemetryContext } from './TelemetryContext';
import { TelemetryProvider } from './TelemetryProvider';

function TelemetryMain() {
  // const [spans, setSpans] = useState<TransformedSpan[]>([]);
  // const [selectedType, setSelectedType] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    spans,
    selectedType,
    setIsLoading,
    telemetryService,
    getAllTelemetry,
    fetchSpansOfType,
  } = useContext(TelemetryContext);
  // const { telemetry } = useContext(ServicesContext);

  // const getAllTelemetry = async () => {
  //   // try {
  //   const response = await telemetry.getMany();
  //   if (response.ok) {
  //     setSpans(response.body);
  //   }
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // };

  // const fetchSpansOfType = async (type: string) => {
  //   // try {
  //   const response = await telemetry.getSpansOfType(type);
  //   if (response.ok) {
  //     setSpans(response.body);
  //   }
  //   //   else {
  //   //     throw new Error(response.statusText);
  //   //   }
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // };

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
        <Heading size="3xl">Telemetry Data</Heading>
        <TelemetryTypeSelector
        // selectedType={selectedType}
        // setSelectedType={setSelectedType}
        // setIsLoading={setIsLoading}
        />
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
