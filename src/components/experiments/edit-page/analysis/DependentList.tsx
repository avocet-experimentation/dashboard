import { Text } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import {
  ElementListRoot,
  ElementListItem,
} from '#/components/helpers/ElementList';
import { Metric } from '@avocet/core';
import ValueTypeIcon from '#/components/helpers/ValueTypeIcon';
import { DeleteButton, EditButton } from '#/components/helpers/Buttons';

/**
 * (WIP) List dependent variables on an experiment
 * todo:
 * - make edit buttons functional
 * - switch to grid
 * - style to resemble linked flags accordion triggers
 */
export function DependentList() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const handleDeleteClick = (depToDelete: Metric) => {
    mutate({
      dependents: experiment.dependents.filter(
        (dep) => dep.fieldName !== depToDelete.fieldName,
      ),
    });
  };

  return (
    <ElementListRoot>
      {experiment.dependents.map((dep) => (
        <ElementListItem
          icon={<ValueTypeIcon type={dep.type} />}
          key={dep.fieldName}
        >
          <Text>{dep.fieldName}</Text>
          <EditButton
            label={`Edit dependent: ${dep.fieldName}`}
            onClick={() => {}}
          />
          <DeleteButton
            label={`Delete dependent: ${dep.fieldName}`}
            onClick={() => handleDeleteClick(dep)}
          />
        </ElementListItem>
      ))}
    </ElementListRoot>
  );
}
