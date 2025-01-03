import { COLORS } from '#/lib/constants';
import { Experiment, ExperimentGroup } from '@avocet/core';
import {
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react/tabs';
import { useMutation } from '@tanstack/react-query';
import { Square } from 'lucide-react';
import { useState } from 'react';
import { EditableGenerals } from './EditableGenerals';
import SortableTreatmentList from './SortableTreatmentList';
import { getRequestFunc, UPDATE_EXPERIMENT } from '#/lib/graphql-queries';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import AddGroupTreatment from './AddGroupTreatment';

export default function GroupTabsView({
  experiment,
}: {
  experiment: Experiment;
}) {
  const [selectedTab, setSelectedTab] = useState<string>(
    experiment.groups[0].id,
  );

  const { mutate } = useMutation({
    mutationFn: async (groups: ExperimentGroup[]) =>
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: {
          groups: groups,
          id: experiment.id,
        },
      })(),
    mutationKey: ['experiment', experiment.id],
    onSuccess: () => {
      toastSuccess('Experiment updated successfully.');
    },
    onError: () => {
      toastError('Could not update the experiment at this time.');
    },
  });

  return (
    <Tabs.Root
      value={selectedTab}
      variant="outline"
      size="md"
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List>
        {experiment.groups.map((group: ExperimentGroup, idx: number) => (
          <Tabs.Trigger value={group.id} key={`${group.id}-tab`}>
            <Icon color={COLORS[idx]} marginRight="2.5px">
              <Square />
            </Icon>
            {group.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.ContentGroup>
        {experiment.groups.map((group: ExperimentGroup, idx: number) => {
          return (
            <Tabs.Content value={group.id} key={`${group.id}-body`}>
              <Stack>
                <Flex dir="row" justifyContent="space-between">
                  <EditableGenerals
                    fieldName="Name"
                    includeName={true}
                    defaultValue={group.name}
                    inputType="text"
                    onValueCommit={(e) => {
                      experiment.groups[idx].name = e.value;
                      mutate(experiment.groups);
                    }}
                  />
                  <EditableGenerals
                    fieldName="Proportion"
                    includeName={true}
                    defaultValue={String(group.proportion)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.groups[idx].proportion = Number(e.value);
                      mutate(experiment.groups);
                    }}
                  />
                  <EditableGenerals
                    fieldName="Cycles"
                    includeName={true}
                    defaultValue={String(group.cycles)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.groups[idx].cycles = Number(e.value);
                      mutate(experiment.groups);
                    }}
                  />
                </Flex>
                <Grid templateColumns="1fr 4fr" alignItems="center">
                  <GridItem>
                    <Text>
                      Treatments (
                      {Object.keys(experiment.definedTreatments).length})
                    </Text>
                  </GridItem>
                  <GridItem>
                    <AddGroupTreatment
                      experiment={experiment}
                      group={group}
                      idx={idx}
                      mutate={mutate}
                    />
                  </GridItem>
                </Grid>
                <Stack>
                  <SortableTreatmentList
                    experiment={experiment}
                    group={group}
                    idx={idx}
                  />
                </Stack>
              </Stack>
            </Tabs.Content>
          );
        })}
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
