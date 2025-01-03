import {
  Box,
  EditableValueChangeDetails,
  Heading,
  Stack,
} from '@chakra-ui/react';
import LinkedFlagsSection from './LinkedFlagsSection';
import PageEditable from '#/components/forms/PageEditable';
import PageSelect from '#/components/forms/PageSelect';
import DefinedTreatments from './DefinedTreatments';
import VariationGroupsSection from './VariationGroupsSection';
import { useExperimentContext } from './ExperimentContext';
import { useAllEnvironments } from '#/hooks/query-hooks';

/**
 * (WIP) Parent component for all editable fields
 * todo:
 * - tooltip on experiment start button to clarify what conditions are pending
 * - tooltips on experiment pause/complete buttons to warn users
 */
export function ExperimentOverview() {
  const { useExperiment, useUpdateExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();
  const { mutate } = useUpdateExperiment();
  const environmentsQuery = useAllEnvironments();

  if (!experiment) return <></>;

  return (
    <Box>
      {/* <Stack gap={4} padding="25px" height="100vh" overflowY="scroll"> */}
      <Stack gap={4}>
        <PageEditable
          label="Description"
          initialValue={experiment.description ?? ''}
          submitHandler={async (e: EditableValueChangeDetails) => {
            mutate({ description: e.value });
          }}
        />
        <PageEditable
          label="Hypothesis"
          initialValue={experiment.hypothesis ?? ''}
          submitHandler={async (e: EditableValueChangeDetails) => {
            mutate({ hypothesis: e.value });
          }}
        />
        <PageSelect
          options={
            environmentsQuery.data?.map((env) => ({
              label: env.name,
              value: env.name,
            })) ?? []
          }
          label="Environment"
          selected={
            experiment.environmentName ? [experiment.environmentName] : []
          }
          handleValueChange={(selectedEnvIds) =>
            mutate({ environmentName: selectedEnvIds[0] })
          }
        />
      </Stack>
      <Box>
        <Heading size="xl" marginBottom="15px">
          Implementation
        </Heading>
        <Stack gap={4}>
          <LinkedFlagsSection />
          <DefinedTreatments experiment={experiment} />
          <VariationGroupsSection experiment={experiment} />
        </Stack>
      </Box>
      {/* </Stack> */}
    </Box>
  );
}
