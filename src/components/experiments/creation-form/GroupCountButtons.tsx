import { Flex, Stack } from '@chakra-ui/react';
import { Button } from '../../ui/button';
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';
import { ExperimentGroup, FlagState, Treatment } from '@avocet/core';
import { CircleEqual, CircleMinus, CirclePlus } from 'lucide-react';
import { DefinedTreatments, ExperimentType } from './ExperimentForm';
import deepcopy from 'deepcopy';

interface Props {
  addGroup: UseFieldArrayAppend<FieldValues, 'groups'>;
  definedTreatments: DefinedTreatments;
  expType: ExperimentType;
  groupFields: Record<'id', string>[];
  groupValues: ExperimentGroup[];
  removeGroup: UseFieldArrayRemove;
}

export default function GroupCountButtons({
  addGroup,
  definedTreatments,
  expType,
  groupFields,
  groupValues,
  removeGroup,
}: Props) {
  const { control, setValue } = useFormContext();

  const setEqualProportions = (): void => {
    let sum = 0;
    const numOfVariations: number = groupValues.length;
    const split: number = Math.trunc((1 / numOfVariations) * 10000);
    let remainder = 10000 - split * numOfVariations;
    for (let idx = 0; idx < groupValues.length; idx += 1) {
      let refinedSplit = split;
      if (remainder > 0) {
        refinedSplit += 1;
        remainder -= 1;
      }
      setValue(`groups.${idx}.proportion`, refinedSplit / 10000);
    }
    console.log(sum);
  };

  const handleAddTreatmentGroup = (): void => {
    const newTreatment = Treatment.template({
      name: `Treatment ${Object.keys(definedTreatments).length}`,
    });
    const firstTreatmentId: string = Object.keys(definedTreatments)[0];
    const curFlagStates: FlagState[] =
      definedTreatments[firstTreatmentId].flagStates;
    const tempFlagStates = curFlagStates.map(({ id }) => ({
      id,
      value: '',
    }));
    newTreatment.flagStates = tempFlagStates;

    setValue('definedTreatments', {
      ...definedTreatments,
      [newTreatment.id]: newTreatment,
    });
    if (expType === 'ab') {
      addGroup(
        ExperimentGroup.template({
          name: `Variation Group ${groupFields.length}`,
        }),
      );
    }
  };

  // const handleRemoveTreatmentGroup = (): void => {
  //   const groupsCount = groupFields.length;
  //   const definedTreatmentsKeys: string[] = Object.keys(definedTreatments);
  //   const definedTreatmentsCount: number = definedTreatmentsKeys.length;
  //   const lastTreatmentId: string =
  //     definedTreatmentsKeys[definedTreatmentsCount - 1];
  //   const definedTreatmentsCopy = deepcopy(lastTreatmentId);
  //   delete definedTreatmentsCopy[lastTreatmentId];
  //   setValue('definedTreatments', definedTreatmentsCopy);
  //   if (expType === 'ab') {
  //     removeGroup(groupsCount - 1);
  //   }
  // };

  return (
    <Flex dir="row" justifyContent="space-between" width="100%">
      <Stack gap="1">
        <Button
          border="0px"
          variant="plain"
          background="transparent"
          _hover={{ backgroundColor: 'transparent', color: 'blue' }}
          onClick={handleAddTreatmentGroup}
        >
          <CirclePlus />
          {expType === 'ab' ? 'Add new group/treatment' : 'Add new treatment'}
        </Button>
        {/* {Object.keys(definedTreatments).length > 2 && (
          <Button
            border="0px"
            variant="plain"
            background="transparent"
            _hover={{ backgroundColor: 'transparent', color: 'blue' }}
            onClick={handleRemoveTreatmentGroup}
          >
            <CircleMinus />
            {expType === 'ab'
              ? 'Remove last group/treatment'
              : 'Remove last treatment'}
          </Button>
        )} */}
      </Stack>
      {expType === 'ab' && (
        <Button
          border="0px"
          variant="plain"
          background="transparent"
          _hover={{ backgroundColor: 'transparent', color: 'blue' }}
          onClick={setEqualProportions}
        >
          <CircleEqual />
          Set equal proportions
        </Button>
      )}
    </Flex>
  );
}
