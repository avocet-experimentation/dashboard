import PageSelect from '#/components/forms/PageSelect';
import { ExperimentGroup } from '@avocet/core';
import { useExperimentContext } from './ExperimentContext';

export default function AddGroupTreatment({
  group,
}: {
  group: ExperimentGroup;
}) {
  const { experiment, useUpdateExperiment } = useExperimentContext();
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
      label="Treatments"
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

        group.sequence.push(selectedTreatment);

        mutate({ groups: experiment.groups });
      }}
    />
  );
}
