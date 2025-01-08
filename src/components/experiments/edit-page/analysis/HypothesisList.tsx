import { Text, VStack } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import {
  ElementListRoot,
  ElementListItem,
} from '#/components/helpers/ElementList';
import {
  Condition,
  ConditionReference,
  ExperimentDraft,
  ExperimentGroup,
  Hypothesis,
  Treatment,
} from '@avocet/core';
import ValueTypeIcon from '#/components/helpers/ValueTypeIcon';
import { DeleteButton } from '#/components/helpers/Buttons';
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

  const findCondition = (conditionRef: ConditionReference) =>
    ExperimentDraft.getConditionFromRef(experiment, conditionRef);

  const getHypothesisConditions = (hypothesis: Hypothesis) => {
    const errorMessage = (conditionType: string) =>
      `Couldn't find ${conditionType} condition for hypothesis ` +
      `${JSON.stringify(hypothesis)}`;

    const baseCondition = findCondition(hypothesis.baseConditionRef);
    if (!baseCondition) throw new TypeError(errorMessage('base'));

    const testCondition = findCondition(hypothesis.testConditionRef);
    if (!testCondition) throw new TypeError(errorMessage('test'));
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
        onClick={onDeleteClick}
      />
    </ElementListItem>
  );
}
