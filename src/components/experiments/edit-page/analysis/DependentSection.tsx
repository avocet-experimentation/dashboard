import { HStack, Heading, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useExperimentContext } from '../ExperimentContext';
import { useAllTelemetryTypes } from '#/hooks/query-hooks';
import { DependentCreationForm } from './DependentCreationForm';
import PageSelect from '#/components/forms/PageSelect';
import { DependentList } from './DependentList';
import PageSection from '#/components/helpers/PageSection';
import { PageToolTip } from '#/components/helpers/PageToolTip';

/**
 * Box for managing dependent variables on an experiment
 * todo:
 * - turn into a table with columns Data Type, Field Name, and Action
 *   - then remove the placeholder Field wrapping the Add button
 */
export default function DependentSection() {
  const { experiment, useUpdateExperiment } = useExperimentContext();

  return (
    <PageSection>
      <HStack gap="2.5">
        <Heading size="lg">Dependent Variables</Heading>

        <PageToolTip
          content={
            'To add a new dependent variable, enter the name of an attribute' +
            ' and choose the type of the data stored on it.'
          }
        />
      </HStack>
      <DependentList />
      <DependentCreationForm />
      {/* <ExperimentDependentSelector /> */}
    </PageSection>
  );
}

function ExperimentDependentSelector() {
  const { useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();
  const spanTypesQuery = useAllTelemetryTypes();

  const spanTypes = useMemo(() => {
    if (!spanTypesQuery.data) return [];
    return spanTypesQuery.data.map((type) => ({
      label: type,
      value: type,
    }));
  }, [spanTypesQuery.data]);

  return (
    <Stack>
      <PageSelect
        options={spanTypes}
        placeholder="add a dependent variable..."
      />
    </Stack>
  );
}
