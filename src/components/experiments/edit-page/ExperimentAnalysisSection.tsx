import { Box, Stack } from '@chakra-ui/react';
import DependentSection from './analysis/DependentSection';
import HypothesesSection from './analysis/HypothesesSection';
import ResultsSection from './analysis/ResultsSection';

/**
 * (WIP) For setting the variable of interest and viewing data
 * todo:
 * - hypothesis definition
 * - add optional description field to dependent variables
 * - (placeholder) show averages per treatment per group in realtime
 * - install inference package
 */
export default function ExperimentAnalysisSection() {
  return (
    <Box>
      <Stack gap={4}>
        <DependentSection />
        <HypothesesSection />
        <ResultsSection />
      </Stack>
    </Box>
  );
}
