import PageSection from '#/components/helpers/PageSection';
import { HStack, Heading, VStack } from '@chakra-ui/react';
import { PageToolTip } from '#/components/helpers/PageToolTip';
import { useExperimentContext } from '../ExperimentContext';
import { HypothesisListItem } from './HypothesisList';
import {
  Experiment,
  ExperimentDraft,
  Hypothesis,
  TransformedSpan,
} from '@avocet/core';
import TelemetryService from '#/services/TelemetryService';
import { useQuery } from '@tanstack/react-query';
import ErrorBox from '#/components/helpers/ErrorBox';
import Loader from '#/components/helpers/Loader';

/**
 * (WIP) Display results once an experiment is completed
 *
 * todo:
 * - list results of each analysis alongside the hypothesis
 * - (later) chart with dropdowns for dependent variable and two conditions
 *   to compare
 */
export default function ResultsSection() {
  const { experiment } = useExperimentContext();
  const toolTipContent =
    experiment.status === 'completed'
      ? ''
      : 'This will be populated once the experiment is complete.';

  return (
    <PageSection>
      <HStack gap="2.5">
        <Heading size="lg">Results</Heading>
        <PageToolTip content={toolTipContent} />
        {experiment.status === 'completed' && <ExperimentResults />}
      </HStack>
    </PageSection>
  );
}

/**
 * (WIP) Hook to collect and format experiment data
 * algorithm:
 * - (done) get the set of all matching metadata for the experiment by getting every
 *   triple of experiment, group, and treatment IDs
 * - get spans matching the experiment (for now, fetch all spans containing
 *   any of the experiment's dependent variables and then filter/bin by condition)
 * - format data as { [groupId]: { [treatmentId]: { [dependent.fieldName]: values: (dependent.type)[] } } }
 *   OR denormalize to { [`groupId+treatmentId+dependent.fieldName`]: values: (dependent.type)[] }
 *   OR to the middle case of { [Condition]: { [dependent.fieldName]: values: (dependent.type)[] } }
 * - make Sets of metadata and flag keys to filter and bin spans by
 *   - spans containing any one of `avocet.feature-flag.${flagName}.metadata` for each flag defined on the experiment
 *   - then filter for metadata matching `^${experimentId}+`
 *   - then bin by condition
 *
 * todo:
 * - implement algorithm above
 * - move as much logic as possible to helper methods
 * - move hook to context provider/separate file
 */
const useExperimentData = (experiment: Experiment) => {
  const conditionRefs = ExperimentDraft.getAllConditionRefs(experiment);
  const allMetadata = conditionRefs.map(
    (ref) => `${experiment.id}+${ref.join('+')}`,
  );

  const telemetry = new TelemetryService();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['experiment-data', experiment.id],
    queryFn: async () => {
      const promises = experiment.dependents.map(({ fieldName }) => [
        fieldName,
        telemetry.getSpansOfType(fieldName),
      ]);
      const result = await Promise.all(promises);
      return Object.fromEntries(result) as Record<string, TransformedSpan[]>;
    },
  });

  if (isPending) return <Loader label="fetching data..." />;
  if (isError) return <ErrorBox error={error} />;
};

/**
 * (WIP) Display results of completed experiments
 */
function ExperimentResults() {
  const { experiment } = useExperimentContext();
  const experimentData = useExperimentData(experiment);

  return (
    <VStack>
      {experiment.hypotheses.map((hypothesis) => {
        return (
          <HStack>
            <HypothesisListItem
              hypothesis={hypothesis}
              onDeleteClick={null}
              {...ExperimentDraft.getHypothesisConditions(
                experiment,
                hypothesis,
              )}
            />
            <Result hypothesis={hypothesis} />
          </HStack>
        );
      })}
    </VStack>
  );
}

/** (WIP) Display a single hypothesis' result */
function Result({ hypothesis }: { hypothesis: Hypothesis }) {
  return <></>;
}
