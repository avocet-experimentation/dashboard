import PageSelect from '#/components/forms/PageSelect';
import { ExperimentGroup } from '@avocet/core';
import { useMemo } from 'react';
import { useExperimentContext } from './ExperimentContext';

export default function AddGroupTreatment({
  group,
  idx,
}: {
  group: ExperimentGroup;
  idx: number;
}) {
  const { useExperiment, useUpdateExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();
  const { mutate } = useUpdateExperiment();

  const treatmentIds = new Set(group.sequence);
  const availableTreatments = Object.keys(experiment.definedTreatments).filter(
    (treatment) => !treatmentIds.has(treatment),
  );
  const options = availableTreatments.map((treatmentId) => ({
    label: experiment.definedTreatments[treatmentId].name,
    value: treatmentId,
  }));

  return (
    <PageSelect
      placeholder={
        availableTreatments && availableTreatments.length
          ? 'Add a treatment...'
          : 'You have selected all available treatments.'
      }
      options={options}
      disabled={!availableTreatments || availableTreatments.length === 0}
      handleValueChange={(selectedTreatmentIds) => {
        const selectedTreatment = availableTreatments.find(
          (treatment) => selectedTreatmentIds[0] === treatment,
        );
        if (!selectedTreatment) {
          throw new Error(
            `No treatment was found matching selected ID "${selectedTreatmentIds[0]}"`,
          );
        }

        experiment.groups[idx].sequence.push(selectedTreatment);

        mutate({ groups: experiment.groups });
      }}
    />
  );
}
