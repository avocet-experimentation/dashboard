import { HStack, Text } from '@chakra-ui/react';
import { useExperimentContext } from '../ExperimentContext';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Hypothesis,
  hypothesisSchema,
  SchemaParseError,
  ExperimentDraft,
  ConditionReference,
} from '@avocet/core';
import ControlledSelect from '#/components/forms/ControlledSelect';
import ControlledTextInput from '#/components/forms/ControlledTextInput';
import { Button } from '#/components/ui/button';
import { numberAnalyses, operators } from './inference';

const analysisOptions = Object.keys(numberAnalyses).map((key) => ({
  label: key,
  value: key,
}));

const operatorOptions = operators.map((operator) => ({
  label: operator,
  value: operator,
}));

type HypothesisFormContent = Pick<
  Hypothesis,
  'compareOperator' | 'compareValue'
> & {
  analysis: string[];
  dependentName: string[];
  baseConditionRef: string[];
  testConditionRef: string[];
};
/**
 * (WIP) hypothesis creation form
 * todo:
 * - add tooltip on each input
 * - consider disabling test condition dropdown until baseline is selected
 *   - then resetting test condition when baseline is changed
 *   - and limiting test condition options to only those that have the same group OR same treatment
 * - change to a management modal
 * - filter analysis methods for those that work on the dependent variable's data type
 * - select a compare operator = > < >= <=
 * - add presets to streamline this?
 * - filter both condition dropdowns to exclude an already-selected condition on the other side
 * - show hypothesis list (similar to dependent variable list)
 * - switch from stacks to grid for arranging inputs
 */
export function HypothesisCreationForm() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const conditions = ExperimentDraft.getAllExperimentConditions(experiment);

  const dependentOptions = experiment.dependents.map((dep) => ({
    label: dep.fieldName,
    value: dep.fieldName,
  }));

  const conditionOptions = conditions.map(([group, treatment]) => ({
    label: `${group.name}: ${treatment.name}`,
    value: JSON.stringify([group.id, treatment.id]),
  }));

  const formMethods = useForm<HypothesisFormContent>({
    defaultValues: {
      analysis: [analysisOptions[0].value],
      compareOperator: '>',
      compareValue: 0,
    },
  });

  if (!experiment.dependents.length) {
    return (
      <Text fontSize="md">Define at least one dependent variable first.</Text>
    );
  }

  const handleFormSubmit = (formContent: HypothesisFormContent) => {
    console.log({ formContent });
    const newHypothesis = Hypothesis.template({
      ...formContent,
      analysis: formContent.analysis[0],
      dependentName: formContent.dependentName[0],
      baseConditionRef: JSON.parse(formContent.baseConditionRef[0]),
      testConditionRef: JSON.parse(formContent.testConditionRef[0]),
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
            fieldPath="baseConditionRef"
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
            fieldPath="testConditionRef"
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
