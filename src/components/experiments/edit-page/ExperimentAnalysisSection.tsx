import PageSelect from '#/components/forms/PageSelect';
import { ServicesContext } from '#/services/ServiceContext';
import TelemetryTypeSelector from '#/components/telemetry/TelemetryTypeSelector';
import { Experiment, Metric } from '@avocet/core';
import { Box, createListCollection } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

interface SpanTypeListItem {
  label: string;
  value: string;
}

interface ExperimentAnalysisSectionProps {
  experiment: Experiment;
}

/**
 * (WIP) For setting the variable of interest and
 * viewing data
 */
export default function ExperimentAnalysisSection({
  experiment,
}: ExperimentAnalysisSectionProps) {
  const [depVars, setDepVars] = useState<Metric[]>(experiment.dependents);
  console.log('dependent variables:');
  console.table(depVars);

  return (
    <Box>
      <ExperimentDependentSelector />
    </Box>
  );
}

function ExperimentDependentSelector() {
  const [allSpanTypes, setAllSpanTypes] = useState<SpanTypeListItem[]>([]);

  const services = useContext(ServicesContext);

  const fetchSpanTypes = async () => {
    const response = await services.telemetry.getAllSpanTypes();
    if (response.ok) {
      // const spanTypeCollection = createListCollection<SpanTypeListItem>({
      //   items: [
      //     { label: 'all', value: null },
      //     ...response.body.map((type) => ({ label: type, value: type })),
      //   ],
      // });

      setAllSpanTypes([
        { label: 'all', value: 'all' },
        ...response.body.map((type) => ({ label: type, value: type })),
      ]);
    }
  };

  useEffect(() => {
    fetchSpanTypes;
  }, []);

  return <PageSelect options={allSpanTypes} />;
}
