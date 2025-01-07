import { Text, VStack } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import {
  ElementListRoot,
  ElementListItem,
} from '#/components/helpers/ElementList';
import {
  Condition,
  ExperimentGroup,
  Hypothesis,
  Treatment,
} from '@avocet/core';
import ValueTypeIcon from '#/components/helpers/ValueTypeIcon';
import { DeleteButton } from '#/components/helpers/DeleteButton';
/**
 * (WIP) List the hypotheses on an experiment
 * todo:
 * - make entries editable
 * - move form to modal
 * - switch to a grid of cards
 */
export function HypothesisList() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const handleDeleteClick = (hypothesisId: string) => {
    mutate({
      hypotheses: experiment.hypotheses.filter(
        (hypothesis) => hypothesis.id !== hypothesisId,
      ),
    });
  };

  const findCondition = (
    condition: Condition,
  ): [ExperimentGroup, Treatment] | null => {
    const [targetGroupId, targetTreatmentId] = condition;
    const baseGroup = experiment.groups.find(
      (group) => group.id === targetGroupId,
    );
    if (!baseGroup) return null;

    const baseTreatmentId = baseGroup.sequence.find(
      (treatmentId) => treatmentId === targetTreatmentId,
    );

    if (!baseTreatmentId) return null;

    const baseTreatment = experiment.definedTreatments[baseTreatmentId];

    if (!baseTreatment) return null;

    return [baseGroup, baseTreatment];
  };

  const getHypothesisConditions = (hypothesis: Hypothesis) => {
    const errorMessage = (conditionType: string) =>
      `Couldn't find ${conditionType} condition for hypothesis ` +
      `${JSON.stringify(hypothesis)}`;
    const baseCondition = findCondition(hypothesis.baseCondition);
    if (!baseCondition) throw new TypeError(errorMessage('base'));
    const testCondition = findCondition(hypothesis.testCondition);
    if (!testCondition) throw new TypeError(errorMessage('base'));
    return { baseCondition, testCondition };
  };

  return (
    <ElementListRoot>
      {experiment.hypotheses.map((hypothesis) => (
        <HypothesisListItem
          key={hypothesis.id}
          hypothesis={hypothesis}
          onDeleteClick={() => handleDeleteClick(hypothesis.id)}
          {...getHypothesisConditions(hypothesis)}
        />
      ))}
    </ElementListRoot>
  );
}

const conditionDisplayName = (cond: [ExperimentGroup, Treatment]) =>
  `(${cond[0].name} Group: ${cond[1].name} Treatment)`;

function HypothesisListItem({
  hypothesis,
  baseCondition,
  testCondition,
  onDeleteClick,
}: {
  baseCondition: [ExperimentGroup, Treatment];
  testCondition: [ExperimentGroup, Treatment];
  hypothesis: Hypothesis;
  onDeleteClick: () => void;
}) {
  const { id, dependentName, analysis, compareOperator, compareValue } =
    hypothesis;
  const baseConditionDisplay = conditionDisplayName(baseCondition);
  const testConditionDisplay = conditionDisplayName(testCondition);
  // TODO: format conditions, analysis etc so they stand out
  const analysisLine =
    `"${dependentName}": ${analysis} ${compareOperator} ` + `${compareValue}`;
  const deltaConditionLine = `${testConditionDisplay} against`;
  const baseConditionLine = `baseline ${baseConditionDisplay}`;
  return (
    <ElementListItem
    // icon={<ValueTypeIcon type={hyp.type} />}
    >
      <VStack gap={2} bg="avocet-bg">
        <Text>{analysisLine}</Text>
        <Text>{deltaConditionLine}</Text>
        <Text>{baseConditionLine}</Text>
      </VStack>

      <DeleteButton
        label={`Delete hypothesis: ${id}`}
        onDeleteClick={onDeleteClick}
      />
    </ElementListItem>
  );
}
