import { Text, VStack } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import {
  ElementListRoot,
  ElementListItem,
} from '#/components/helpers/ElementList';
import {
  Condition,
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

  return (
    <ElementListRoot>
      {experiment.hypotheses.map((hypothesis) => (
        <HypothesisListItem
          key={hypothesis.id}
          hypothesis={hypothesis}
          onDeleteClick={() => handleDeleteClick(hypothesis.id)}
          {...ExperimentDraft.getHypothesisConditions(experiment, hypothesis)}
        />
      ))}
    </ElementListRoot>
  );
}

const conditionDisplayName = (cond: [ExperimentGroup, Treatment]) =>
  `(${cond[0].name} Group: ${cond[1].name} Treatment)`;

export function HypothesisListItem({
  hypothesis,
  baseCondition,
  testCondition,
  onDeleteClick,
}: {
  baseCondition: Condition;
  testCondition: Condition;
  hypothesis: Hypothesis;
  onDeleteClick: (() => void) | null;
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

      {hypothesis ? (
        <DeleteButton
          label={`Delete hypothesis: ${id}`}
          onClick={onDeleteClick ?? (() => {})}
        />
      ) : undefined}
    </ElementListItem>
  );
}
