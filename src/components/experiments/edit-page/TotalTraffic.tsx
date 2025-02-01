import { Slider } from '#/components/ui/slider';
import { HStack, Heading, Text, Editable } from '@chakra-ui/react';
import { useState } from 'react';
import { useExperimentContext } from './ExperimentContext';

const PROPORTION_MIN = 0;
const PROPORTION_MAX = 1;
const PROPORTION_MULT = 100;
const PROPORTION_STEPS = 1000;
const PROPORTION_STEP_SIZE =
  ((PROPORTION_MAX - PROPORTION_MIN) / PROPORTION_STEPS) * PROPORTION_MULT;

/**
 * Slider and editable for setting the enrollment proportion on an experiment
 */
export function TotalTraffic() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const [propSlider, setPropSlider] = useState([
    experiment.enrollment.proportion * PROPORTION_MULT,
  ]);
  const { mutate } = useUpdateExperiment();

  return (
    <>
      <HStack gap={2}>
        <Editable.Root
          activationMode="focus"
          value={String(propSlider[0])}
          fontSize="inherit"
          onValueChange={({ value }) => {
            setPropSlider([Number(value)]);
          }}
          onValueCommit={(e) => {
            const newValue = Number(e.value);
            setPropSlider([newValue]);
            mutate({
              enrollment: {
                ...experiment.enrollment,
                proportion: newValue / PROPORTION_MULT,
              },
            });
          }}
          onFocusOutside={(e) => {
            setPropSlider([experiment.enrollment.proportion]);
          }}
        >
          <HStack gap={2} alignItems="center">
            <Heading size={'sm'}>
              {'Traffic included in this experiment:'}
            </Heading>
            <Editable.Preview _hover={{ bg: 'avocet-hover' }} />
            <Editable.Input type="number" />
            <Text>%</Text>
          </HStack>
        </Editable.Root>
      </HStack>
      <Slider
        cursor="grab"
        width="full"
        onFocusChange={({ focusedIndex }) => {
          // if (focusedIndex !== -1) return;
          // field.onBlur();
        }}
        name="Proportion of traffic to include"
        min={PROPORTION_MIN}
        max={PROPORTION_MAX * PROPORTION_MULT}
        step={PROPORTION_STEP_SIZE}
        value={propSlider}
        marks={[
          { value: 0, label: '0%' },
          { value: 50, label: '50%' },
          { value: 100, label: '100%' },
        ]}
        onValueChange={({ value }) => {
          setPropSlider(value);
        }}
        onValueChangeEnd={({ value }) => {
          mutate({
            enrollment: {
              ...experiment.enrollment,
              proportion: value[0] / PROPORTION_MULT,
            },
          });
        }}
      />
    </>
  );
}
