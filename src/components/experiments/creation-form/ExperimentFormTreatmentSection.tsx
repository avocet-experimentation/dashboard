import { Fieldset, HStack, Stack } from '@chakra-ui/react';
import { RadioGroup, Radio } from '../../ui/radio';
import ExperimentGroupField from './ExperimentGroupField';
import ExperimentTreatmentField from './ExperimentTreatmentField';
import { useFormContext } from 'react-hook-form';
import { ExperimentType } from './ExperimentForm';
import { ExperimentDraft } from '@avocet/core';

interface ExperimentFormTreatmentSectionProps {
  expType: ExperimentType;
  setExpType: React.Dispatch<React.SetStateAction<ExperimentType>>;
  setFormValues: React.Dispatch<
    React.SetStateAction<{ ab: ExperimentDraft; switchback: ExperimentDraft }>
  >;
}
export default function ExperimentFormTreatmentSection({
  expType,
  setExpType,
  setFormValues,
}: ExperimentFormTreatmentSectionProps) {
  const { getValues, watch } = useFormContext();
  const definedTreatments = watch('definedTreatments');

  const handleSwitchForm = (newExpType: 'ab' | 'switchback') => {
    const currentValues = getValues();
    setFormValues((prevState) => ({
      ...prevState,
      [expType]: currentValues, // Save current form values
    }));
    setExpType(newExpType); // Update form type
  };
  return (
    <Stack gap="4">
      <Fieldset.Root>
        <Fieldset.Legend>Experiment Type</Fieldset.Legend>
        <RadioGroup
          defaultValue={expType}
          onValueChange={({ value }) =>
            handleSwitchForm(value as ExperimentType)
          }
        >
          <HStack gap="6">
            <Radio value="ab" cursor="pointer">
              A/B
            </Radio>
            <Radio value="switchback" cursor="pointer">
              Switchback
            </Radio>
          </HStack>
        </RadioGroup>
      </Fieldset.Root>
      <HStack alignItems="start">
        <ExperimentTreatmentField />
        <ExperimentGroupField
          expType={expType}
          definedTreatments={definedTreatments}
        />
      </HStack>
    </Stack>
  );
}
