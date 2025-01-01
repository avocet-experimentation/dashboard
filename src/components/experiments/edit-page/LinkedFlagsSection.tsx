import { AccordionRoot } from '#/components/ui/accordion';
import { Experiment, ExperimentDraft, FeatureFlag } from '@avocet/core';
import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ALL_FEATURE_FLAGS, getRequestFunc } from '#/lib/graphql-queries';
import ErrorBox from '#/components/helpers/ErrorBox';
import Loader from '#/components/helpers/Loader';
import { LinkedFlagInfo } from './LinkedFlagInfo';
import { UPDATE_EXPERIMENT } from '#/lib/experiment-queries';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import PageSelect from '#/components/forms/PageSelect';

export default function LinkedFlagsSection({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: getRequestFunc(ALL_FEATURE_FLAGS, {}),
    placeholderData: { allFeatureFlags: [] } as {
      allFeatureFlags: FeatureFlag[];
    },
  });

  const expFlagIds = useMemo(() => new Set(experiment.flagIds), [experiment]);

  if (isPending) return <Loader label="Loading experiment..." />;
  if (isError) return <ErrorBox error={error} />;

  const linkedFlags = data.allFeatureFlags.filter((flag) =>
    expFlagIds.has(flag.id),
  ) as FeatureFlag[];

  return (
    <Stack padding="15px" bg="white" borderRadius="5px" width="50%">
      <Flex justifyContent="space-between">
        <Heading size="lg">
          Linked Feature Flags ({experiment.flagIds.length})
        </Heading>
      </Flex>
      <AccordionRoot variant="enclosed" multiple>
        {linkedFlags.map((flag: FeatureFlag) => (
          <LinkedFlagInfo key={flag.id} experiment={experiment} flag={flag} />
        ))}
      </AccordionRoot>
      <FlagSelect experiment={experiment} />
    </Stack>
  );
}

interface FlagSelectProps {
  experiment: Experiment;
  // availableFlags: FeatureFlag[];
}

/**
 * (WIP)
 *
 * todo:
 * - fix dropdown list covering relevant info
 * - add search box to PageSelect to filter options by label?
 */
function FlagSelect({ experiment }: FlagSelectProps) {
  const flagsQuery = useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: async () => getRequestFunc(ALL_FEATURE_FLAGS, {})(),
    placeholderData: { allFeatureFlags: [] } as {
      allFeatureFlags: FeatureFlag[];
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (partialEntry: Partial<ExperimentDraft>) =>
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: { ...partialEntry, id: experiment.id },
      })(),
    mutationKey: ['experiment', experiment.id],
  });

  const expFlagIds = useMemo(() => new Set(experiment.flagIds), [experiment]);
  const availableFlags = useMemo(
    () =>
      flagsQuery.data?.allFeatureFlags.filter(
        (flag) => !expFlagIds.has(flag.id),
      ),
    [flagsQuery.data, expFlagIds],
  );

  const options = useMemo(
    () =>
      availableFlags?.map((flag) => ({
        label: flag.name,
        value: flag.id,
      })) ?? [],
    [availableFlags],
  );

  if (flagsQuery.isPending) return <Loader label="loading flags..." />;

  if (flagsQuery.isError) return <ErrorBox error={flagsQuery.error} />;

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
