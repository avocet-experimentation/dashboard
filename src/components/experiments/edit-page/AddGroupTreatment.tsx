import PageSelect from '#/components/forms/PageSelect';
import { Experiment, ExperimentGroup } from '@avocet/core';
import { useMemo } from 'react';

export default function AddGroupTreatment({
  experiment,
  group,
  idx,
  mutate,
}: {
  experiment: Experiment;
  group: ExperimentGroup;
  idx: number;
  mutate: any;
}) {
  const treatmentIds = useMemo(() => new Set(group.sequence), [experiment]);
  const availableTreatments = useMemo(
    () =>
      Object.keys(experiment.definedTreatments).filter(
        (treatment) => !treatmentIds.has(treatment),
      ),
    [experiment.definedTreatments],
  );
  const options = useMemo(
    () =>
      availableTreatments.map((treatmentId) => ({
        label: experiment.definedTreatments[treatmentId].name,
        value: treatmentId,
      })),
    [availableTreatments],
  );

  return (
    <PageSelect
      placeholder={
        availableTreatments && availableTreatments.length
          ? 'Add a treatment...'
          : 'No other treatments'
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

        mutate(experiment.groups);
      }}
    />
  );
}
