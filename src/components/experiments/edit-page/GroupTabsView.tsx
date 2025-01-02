import { COLORS } from '#/lib/constants';
import { Experiment, ExperimentGroup } from '@avocet/core';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react/tabs';
import { UseMutateFunction } from '@tanstack/react-query';
import { Square } from 'lucide-react';
import { FC, useState } from 'react';
import { EditableGenerals } from './EditableGenerals';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';

export default function GroupTabsView({
  experiment,
  mutate,
}: {
  experiment: Experiment;
  mutate: UseMutateFunction<void, Error, ExperimentGroup[], unknown>;
}) {
  const [selectedTab, setSelectedTab] = useState<string>(
    experiment.groups[0].id,
  );
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
                      experiment.groups[idx].name = e.value;
                      mutate(experiment.groups);
                    }}
                  />
                  <EditableGenerals
                    fieldName="Cycles"
                    includeName={true}
                    defaultValue={String(group.cycles)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.groups[idx].name = e.value;
                      mutate(experiment.groups);
                    }}
                  />
                </Flex>
                <Stack>
                  <DndProvider backend={HTML5Backend}></DndProvider>
                </Stack>
              </Stack>
            </Tabs.Content>
          );
        })}
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}

export interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

function Card({ id, text, index, moveCard }: CardProps) {
  // TODO: create drag and drop functionality
}
