import { Experiment, ExperimentGroup, Treatment } from '@avocet/core';
import {
  createListCollection,
  Grid,
  GridItem,
  Heading,
  Stack,
} from '@chakra-ui/react';
import GroupPieChart from './GroupPieChart';
import { UPDATE_EXPERIMENT } from '#/lib/experiment-queries';
import { useMutation } from '@tanstack/react-query';
import { getRequestFunc } from '#/lib/graphql-queries';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import GroupTabsView from './GroupTabsView';

const createTreatmentCollection = (definedTreatments: Treatment) => {
  const items = Object.entries(definedTreatments).map(([id, treatment]) => ({
    label: treatment.name,
    value: id,
  }));
  return createListCollection({ items });
};

export default function GroupTables({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { mutate } = useMutation({
    mutationFn: async (groups: ExperimentGroup[]) => {
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: {
          groups: groups,
          id: experiment.id,
        },
      })();
    },
    mutationKey: ['experiment', experiment.id],
    onSuccess: () => {
      toastSuccess('Experiment updated successfully.');
    },
    onError: () => {
      toastError('Could not update the experiment at this time.');
    },
  });

  const getTreatmentName = (treatmentId: string) => {
    return experiment.definedTreatments[treatmentId].name;
  };

  return (
    <Stack padding="15px" bg="white" borderRadius="5px">
      <Heading size="lg">Variation Groups ({experiment.groups.length})</Heading>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          <GroupPieChart experiment={experiment} />
        </GridItem>
        <GridItem>
          {/* <GroupTableView experiment={experiment} mutate={mutate} /> */}
          <GroupTabsView experiment={experiment} mutate={mutate} />
        </GridItem>
      </Grid>
    </Stack>
  );
}
