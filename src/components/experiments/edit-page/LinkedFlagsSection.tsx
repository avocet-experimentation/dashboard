import { AccordionRoot } from '#/components/ui/accordion';
import { Experiment, ExperimentDraft, FeatureFlag } from '@avocet/core';
import { useMemo } from 'react';
import ErrorBox from '#/components/helpers/ErrorBox';
import Loader from '#/components/helpers/Loader';
import { LinkedFlagInfo } from './LinkedFlagInfo';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import PageSelect from '#/components/forms/PageSelect';
import { useAllFeatureFlags } from '#/hooks/query-hooks';
import { useExperimentContext } from './ExperimentContext';

export default function LinkedFlagsSection() {
  const { isPending, isError, error, data: allFlags } = useAllFeatureFlags();
  const { useExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();

  if (isPending) return <Loader label="Loading experiment..." />;
  if (isError) return <ErrorBox error={error} />;
  if (!experiment) return <></>;

  const expFlagIds = new Set(experiment.flagIds);

  const [availableFlags, linkedFlags] = allFlags.reduce(
    (acc: [FeatureFlag[], FeatureFlag[]], flag) => {
      if (expFlagIds.has(flag.id)) {
        acc[1].push(flag);
      } else acc[0].push(flag);
      return acc;
    },
    [[], []],
  );

  return (
    <Stack padding="15px" bg="white" borderRadius="5px" width="100%">
      <Flex justifyContent="space-between">
        <Heading size="lg">
          Linked Feature Flags ({experiment.flagIds.length})
        </Heading>
      </Flex>
      <AccordionRoot variant="enclosed" multiple>
        {linkedFlags.map((flag: FeatureFlag) => (
          <LinkedFlagInfo key={flag.id} flag={flag} />
        ))}
      </AccordionRoot>
      <FlagSelect experiment={experiment} availableFlags={availableFlags} />
    </Stack>
  );
}

interface FlagSelectProps {
  experiment: Experiment;
  availableFlags: FeatureFlag[];
}

/**
 * (WIP)
 *
 * todo:
 * - fix dropdown list covering relevant info
 * - place alongside title
 * - add search box to PageSelect to filter options by label?
 */
function FlagSelect({ experiment, availableFlags }: FlagSelectProps) {
  const { useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();

  const options = useMemo(
    () =>
      availableFlags?.map((flag) => ({
        label: flag.name,
        value: flag.id,
      })) ?? [],
    [availableFlags],
  );

  if (!availableFlags || availableFlags.length === 0) {
    return (
      <PageSelect placeholder="no flags to add" disabled options={options} />
    );
  }

  return (
    <PageSelect
      placeholder="add a flag..."
      options={options}
      disabled={!availableFlags || availableFlags.length === 0}
      handleValueChange={(selectedFlagIds) => {
        const selectedFlag = availableFlags.find(
          (flag) => selectedFlagIds[0] === flag.id,
        );
        if (!selectedFlag) {
          throw new Error(
            `No flag was found matching selected ID "${selectedFlagIds[0]}"`,
          );
        }

        const update = ExperimentDraft.addFlag(
          structuredClone(experiment),
          selectedFlag satisfies FeatureFlag,
        );

        mutate(update);
      }}
    />
  );
}
