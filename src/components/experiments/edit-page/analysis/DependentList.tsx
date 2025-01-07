import { Text } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import {
  ElementListRoot,
  ElementListItem,
} from '#/components/helpers/ElementList';
import { Metric } from '@avocet/core';
import ValueTypeIcon from '#/components/helpers/ValueTypeIcon';
import { DeleteButton } from '#/components/helpers/DeleteButton';
import { EditButton } from '#/components/helpers/EditButton';

/**
 * (WIP) List dependent variables on an experiment
 * todo:
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
            onEditClick={() => {}}
          />
          <DeleteButton
            label={`Delete dependent: ${dep.fieldName}`}
            onDeleteClick={() => handleDeleteClick(dep)}
          />
        </ElementListItem>
      ))}
    </ElementListRoot>
  );
}
