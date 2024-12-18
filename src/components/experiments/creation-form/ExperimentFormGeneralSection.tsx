import { Stack } from '@chakra-ui/react';
import {
  DescriptionField,
  HypothesisField,
  NameField,
} from '../../forms/DefinedFields';
import ExperimentTotalTrafficSlider from './ExperimentTotalTrafficSlider';

function ExperimentFormGeneralSection() {
  return (
    <Stack gap="4">
      <NameField
        label="Experiment Name"
        helperText="Acts as a unique identifier used to track impressions and analyze results."
      />
      <DescriptionField />
      <HypothesisField />
      <ExperimentTotalTrafficSlider />
    </Stack>
  );
}

export default ExperimentFormGeneralSection;
