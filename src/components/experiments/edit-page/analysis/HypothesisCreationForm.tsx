import { HStack, Text } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ExperimentGroup,
  Hypothesis,
  Treatment,
  hypothesisSchema,
  SchemaParseError,
  Condition,
} from '@avocet/core';
import ControlledSelect from '#/components/forms/ControlledSelect';
import ControlledTextInput from '#/components/forms/ControlledTextInput';
import { Button } from '#/components/ui/button';
import { numberAnalyses, operators } from './inference';

type HypothesisFormContent = Pick<
  Hypothesis,
  'compareOperator' | 'compareValue' | 'analysis'
> & {
  dependentName: string[];
  baseCondition: Condition[];
  testCondition: Condition[];
};
/**
 * (WIP) hypothesis creation form
 * todo:
 *   - change to a management modal
 *   - filter analysis methods for those that work on the dependent variable's data type
 *   - select a compare operator = > < >= <=
 *   - add presets to streamline this?
 *   - filter both condition dropdowns to exclude an already-selected condition on the other side
 * - show hypothesis list (similar to dependent variable list)
 */
export function HypothesisCreationForm() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();
  const analysisOptions = Object.keys(numberAnalyses).map((key) => ({
    label: key,
    value: key,
  }));

  const operatorOptions = operators.map((operator) => ({
    label: operator,
    value: operator,
  }));

  const conditions = experiment.groups.reduce(
    (acc: Array<[ExperimentGroup, Treatment]>, group) => {
      const groupConditions: Array<[ExperimentGroup, Treatment]> =
        group.sequence.map((treatmentId) => {
          const treatment = experiment.definedTreatments[treatmentId];
          return [group, treatment];
        });

      return [...acc, ...groupConditions];
    },
    [],
  );

  const dependentOptions = experiment.dependents.map((dep) => ({
    label: dep.fieldName,
    value: dep.fieldName,
  }));

  const conditionOptions = conditions.map(([group, treatment]) => ({
    label: `${group.name}: ${treatment.name}`,
    value: [group.id, treatment.id] as const,
  }));

  const formMethods = useForm<HypothesisFormContent>({
    defaultValues: {
      // dependentName: dependentOptions[0]?.value,
      analysis: analysisOptions[0].value,
      compareOperator: '=',
      compareValue: 0,
      // baseCondition: conditionOptions[0]?.value,
      // testCondition: conditionOptions[1]?.value,
    },
  });

  if (!experiment.dependents.length) {
    return (
      <Text fontSize="md">Define at least one dependent variable first</Text>
    );
  }

  const handleFormSubmit = (formContent: HypothesisFormContent) => {
    const newHypothesis = Hypothesis.template({
      ...formContent,
      dependentName: formContent.dependentName[0],
      baseCondition: formContent.baseCondition[0],
      testCondition: formContent.testCondition[0],
    });
    const safeParseResult = hypothesisSchema.safeParse(newHypothesis);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    mutate({ hypotheses: [...experiment.hypotheses, safeParseResult.data] });
  };

  return (
    <FormProvider {...formMethods}>
      <form
        id="create-hypothesis-form"
        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
      >
        <HStack gap={2}>
          <ControlledSelect
            width="50%"
            label="Baseline condition"
            fieldPath="baseCondition"
            options={
              conditionOptions
              //   .filter(
              //   (option) =>
              //     option.value !==
              //     formMethods
              //       .getValues('conditionTwo')
              //       .map(([group, treatment]) => [group.id, treatment.id]),
              // )
            }
          />
          <ControlledSelect
            width="50%"
            label="Test condition"
            fieldPath="testCondition"
            options={conditionOptions}
          />
        </HStack>
        <HStack gap={2}>
          <ControlledSelect
            width="50%"
            label="Dependent variable to analyze"
            fieldPath="dependentName"
            options={dependentOptions}
          />
          <ControlledSelect
            width="50%"
            label="Analysis technique"
            fieldPath="analysis"
            options={analysisOptions}
          />
        </HStack>
        <HStack gap={2}>
          <ControlledSelect
            width="50%"
            label="operator for the comparison"
            fieldPath="compareOperator"
            options={operatorOptions}
          />
          <ControlledTextInput
            width="50%"
            fieldPath="compareValue"
            label="Value to compare against"
            registerReturn={formMethods.register('compareValue', {
              valueAsNumber: true,
              required: 'A number value is required.',
            })}
          />
        </HStack>
        <Button
          form="create-hypothesis-form"
          variant="solid"
          type="submit"
          alignContent={'baseline'}
          bottom={'0'}
        >
          Add
        </Button>
      </form>
    </FormProvider>
  );
}
