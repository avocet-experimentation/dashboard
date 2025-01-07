import { ExperimentDraft } from '@avocet/core';
import { useExperimentContext } from './ExperimentContext';
import { Stack } from '@chakra-ui/react';
import { Button } from '#/components/ui/button';
import { CircleEqual, CirclePlus } from 'lucide-react';

export default function GroupsControl() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const handleAddGroup = () => {
    ExperimentDraft.addGroup(experiment);
    mutate({ groups: experiment.groups });
  };

  const setEqualProportions = (): void => {
    const groups = experiment.groups;
    const numOfVariations: number = groups.length;
    const split: number = Math.trunc((1 / numOfVariations) * 10000);
    let remainder = 10000 - split * numOfVariations;
    for (let idx = 0; idx < groups.length; idx += 1) {
      let refinedSplit = split;
      if (remainder > 0) {
        refinedSplit += 1;
        remainder -= 1;
      }
      groups[idx].proportion = refinedSplit / 10000;
    }
    mutate({ groups: experiment.groups });
  };

  return (
    <Stack justifyContent="center" alignItems="center">
      <Button
        width="80%"
        variant="plain"
        _hover={{
          color: 'avocet-plain-button-hover-color',
          bg: 'avocet-plain-button-hover-bg',
        }}
        onClick={handleAddGroup}
      >
        <CirclePlus />
        Add Group
      </Button>
      <Button
        width="80%"
        variant="plain"
        _hover={{
          color: 'avocet-plain-button-hover-color',
          bg: 'avocet-plain-button-hover-bg',
        }}
        onClick={setEqualProportions}
      >
        <CircleEqual />
        Set Equal Proportions
      </Button>
    </Stack>
  );
}
