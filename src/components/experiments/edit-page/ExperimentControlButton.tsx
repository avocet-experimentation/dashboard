import ErrorBox from '#/components/helpers/ErrorBox';
import { Button } from '#/components/ui/button';
import { Tooltip } from '#/components/ui/tooltip';
import { useAllFeatureFlags } from '#/hooks/query-hooks';
import {
  COMPLETE_EXPERIMENT,
  PAUSE_EXPERIMENT,
  START_EXPERIMENT,
} from '#/lib/experiment-queries';
import { gqlRequest } from '#/lib/graphql-queries';
import { Experiment, ExperimentDraft } from '@avocet/core';
import { useMutation } from '@tanstack/react-query';
import { OctagonX, CircleCheckBig, Power } from 'lucide-react';
import { useMemo } from 'react';

export function StartExperimentButton({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { isPending, isError, error, data } = useAllFeatureFlags();

  const { mutate } = useMutation({
    mutationFn: async () => gqlRequest(START_EXPERIMENT, { id: experiment.id }),
    mutationKey: ['experiment', experiment.id],
  });

  const disabled = useMemo(
    () => !data || !ExperimentDraft.isReadyToStart(experiment, data).isReady,
    [experiment, data],
  );

  if (isError) return <ErrorBox error={error} />;
  const status = data ? ExperimentDraft.isReadyToStart(experiment, data) : null;
  // const disabled = !status || status.isReady === false;

  return (
    <Tooltip
      showArrow
      disabled={!status || status.isReady}
      openDelay={50}
      content={status?.errors.join('\n')}
    >
      <Button
        variant="solid"
        loading={isPending}
        disabled={!status || isPending || !status.isReady}
        colorPalette="green"
        onClick={() => mutate()}
      >
        <Power />
        Start
      </Button>
    </Tooltip>
  );
}

export function PauseExperimentButton({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { mutate } = useMutation({
    mutationFn: async () => gqlRequest(PAUSE_EXPERIMENT, { id: experiment.id }),
    mutationKey: ['experiment', experiment.id],
  });

  return (
    <Button variant="solid" colorPalette="red" onClick={() => mutate()}>
      <OctagonX />
      Pause
    </Button>
  );
}

export function CompleteExperimentButton({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { mutate } = useMutation({
    mutationFn: async () =>
      gqlRequest(COMPLETE_EXPERIMENT, { id: experiment.id }),
    mutationKey: ['experiment', experiment.id],
  });

  return (
    <Button variant="solid" colorPalette="red" onClick={() => mutate()}>
      <CircleCheckBig />
      Complete
    </Button>
  );
}
