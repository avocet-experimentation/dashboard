import { COLORS } from '#/lib/constants';
import { ExperimentGroup } from '@avocet/core';
import { Flex, Grid, GridItem, Icon, Stack, Text } from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react/tabs';
import { Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditableGenerals } from '#/components/helpers/EditableGenerals';
import SortableTreatmentList from './SortableTreatmentList';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import AddGroupTreatment from './AddGroupTreatment';
import { Button } from '#/components/ui/button';
import { useExperimentContext } from './ExperimentContext';
import InfoWarning from '#/components/helpers/InfoWarning';

export default function GroupTabsView() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment({});

  const handleDeleteGroup = (groupId: string) => {
    const mutatedGroups = experiment.groups.filter(
      (group) => group.id !== groupId,
    );
    mutate({ groups: mutatedGroups });
  };

  // const handleGeneralUpdate = () => {
  //   mutate({ groups: experiment.groups })
  //     .onSuccess(() => toastSuccess('Experiment updated successfully.'))
  //     .onError(() =>
  //       toastError('Could not update the experiment at this time.'),
  //     );
  // };

  if (experiment?.groups.length === 0)
    return <InfoWarning message="No groups exist in this experiment." />;

  const [selectedTab, setSelectedTab] = useState<string>(
    experiment.groups[0].id,
  );

  return (
    <Tabs.Root
      lazyMount
      value={selectedTab}
      variant="outline"
      size="md"
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List>
        {experiment.groups.map((group: ExperimentGroup, idx: number) => (
          <Tabs.Trigger
            _selected={{ bg: 'avocet-bg' }}
            border="1px solid"
            borderBottom="none"
            value={group.id}
            key={`${group.id}-tab`}
          >
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
            <Tabs.Content
              bg="avocet-bg"
              borderRadius="0px 5px 5px 5px"
              value={group.id}
              key={`${group.id}-body`}
              padding="15px"
            >
              <Stack gap={4}>
                <Flex dir="row" justifyContent="space-between">
                  <EditableGenerals
                    fieldName="Name"
                    includeName={true}
                    defaultValue={group.name}
                    inputType="text"
                    onValueCommit={(e) => {
                      experiment.groups[idx].name = e.value;
                      mutate({ groups: experiment.groups });
                    }}
                  />
                  <EditableGenerals
                    fieldName="Proportion"
                    includeName={true}
                    defaultValue={String(group.proportion)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.groups[idx].proportion = Number(e.value);
                      mutate({ groups: experiment.groups });
                    }}
                  />
                  <EditableGenerals
                    fieldName="Cycles"
                    includeName={true}
                    defaultValue={String(group.cycles)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.groups[idx].cycles = Number(e.value);
                      mutate({ groups: experiment.groups });
                    }}
                  />
                </Flex>
                <AddGroupTreatment group={group} />
                <Stack>
                  {!group.sequence.length ? (
                    <InfoWarning message="No treatments have been selected for this group." />
                  ) : (
                    <SortableTreatmentList group={group} />
                  )}
                </Stack>
                {experiment?.groups.length > 1 && (
                  <Button
                    marginLeft="auto"
                    width="fit-content"
                    onClick={() => {
                      handleDeleteGroup(group.id);
                      console.log(idx);
                      if (idx === 0) setSelectedTab(experiment.groups[1].id);
                      setSelectedTab(experiment.groups[idx - 1].id);
                    }}
                  >
                    <Trash2 />
                    Delete Group
                  </Button>
                )}
              </Stack>
            </Tabs.Content>
          );
        })}
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
