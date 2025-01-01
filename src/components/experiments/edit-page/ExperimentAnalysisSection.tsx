import PageSelect from '#/components/forms/PageSelect';
import { Experiment, Metric } from '@avocet/core';
import { Box } from '@chakra-ui/react';
import { useContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TelemetryContext } from '#/components/telemetry/TelemetryContext';

interface ExperimentAnalysisSectionProps {
  experiment: Experiment;
}

/**
 * (WIP) For setting the variable of interest and viewing data
 * todo:
 * - adding dependents via type selector dropdown or plain text
 * - (for dev reasons) show averages per treatment per group in realtime
 * - install inference package
 */
export default function ExperimentAnalysisSection({
  experiment,
}: ExperimentAnalysisSectionProps) {
  // const [depVars, setDepVars] = useState<Metric[]>(experiment.dependents);
  console.log('dependent variables:');
  console.table(experiment.dependents);

  return (
    <Box>
      <ExperimentDependentSelector />
    </Box>
  );
}

function ExperimentDependentSelector() {
  const { telemetryService } = useContext(TelemetryContext);

  const spanTypesQuery = useQuery({
    queryKey: ['allTelemetry'],
    queryFn: async () => {
      const response = await telemetryService.getAllSpanTypes();
      if (!response.ok) return null;
      return response.body;
    },
  });

  const spanTypes = useMemo(() => {
    if (!spanTypesQuery.data) return [];
    return spanTypesQuery.data.map((type) => ({
      label: type,
      value: type,
    }));
  }, [spanTypesQuery.data]);

  return <PageSelect options={spanTypes} />;
}
