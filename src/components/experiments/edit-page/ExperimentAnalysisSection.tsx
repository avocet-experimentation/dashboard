import PageSelect from '#/components/forms/PageSelect';
import { Box, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useExperimentContext } from './ExperimentContext';
import { useAllTelemetryTypes } from '#/hooks/query-hooks';

/**
 * (WIP) For setting the variable of interest and viewing data
 * todo:
 * - adding dependents via type selector dropdown or plain text
 * - (placeholder) show averages per treatment per group in realtime
 * - install inference package
 */
export default function ExperimentAnalysisSection() {
  const { useExperiment, useUpdateExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();
  if (!experiment) return <></>;
  console.log('dependent variables:');
  console.table(experiment.dependents);

  return (
    <Box>
      <ExperimentDependentSelector />
    </Box>
  );
}

function ExperimentDependentSelector() {
  const { useExperiment, useUpdateExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();
  const { mutate } = useUpdateExperiment();
  const spanTypesQuery = useAllTelemetryTypes();

  const spanTypes = useMemo(() => {
    if (!spanTypesQuery.data) return [];
    return spanTypesQuery.data.map((type) => ({
      label: type,
      value: type,
    }));
  }, [spanTypesQuery.data]);

  if (!experiment) return <></>;

  return (
    <Stack>
      <PageSelect
        options={spanTypes}
        placeholder="add a dependent variable..."
      />
    </Stack>
  );
}
