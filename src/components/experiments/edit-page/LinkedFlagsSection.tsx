import { AccordionRoot } from '#/components/ui/accordion';
import { ExperimentDraft, FeatureFlag } from '@avocet/core';
import { useMemo } from 'react';
import ErrorBox from '#/components/helpers/ErrorBox';
import Loader from '#/components/helpers/Loader';
import LinkedFlagInfo from './LinkedFlagInfo';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import PageSelect from '#/components/forms/PageSelect';
import { useAllFeatureFlags } from '#/hooks/query-hooks';
import { useExperimentContext } from './ExperimentContext';
import InfoWarning from '#/components/helpers/InfoWarning';

export default function LinkedFlagsSection() {
  const { isPending, isError, error, data: allFlags } = useAllFeatureFlags();
  const { experiment } = useExperimentContext();

  if (isPending) return <Loader label="Loading experiment..." />;
  if (isError) return <ErrorBox error={error} />;

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
    <Stack
      padding="15px"
      bg="avocet-section"
      borderRadius="5px"
      width="100%"
      gap={4}
    >
      <Flex justifyContent="space-between">
        <Heading size="lg">
          Linked Feature Flags ({experiment.flagIds.length})
        </Heading>
      </Flex>
      {!linkedFlags.length ? (
        <InfoWarning message="Link a feature flag to define treatments for this experiment." />
      ) : (
        <AccordionRoot variant="enclosed" multiple>
          {linkedFlags.map((flag: FeatureFlag) => (
            <LinkedFlagInfo key={flag.id} flag={flag} />
          ))}
        </AccordionRoot>
      )}
      <FlagSelect availableFlags={availableFlags} />
    </Stack>
  );
}

/**
 * (WIP)
 *
 * todo:
 * - fix dropdown list covering relevant info
 * - place alongside title
 * - add search box to PageSelect to filter options by label?
 */
function FlagSelect({ availableFlags }: { availableFlags: FeatureFlag[] }) {
  const { experiment, useUpdateExperiment } = useExperimentContext();
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
      <PageSelect
        placeholder="All available flags are already selected."
        disabled
        options={options}
      />
    );
  }

  return (
    <PageSelect
      placeholder="Add a flag..."
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
