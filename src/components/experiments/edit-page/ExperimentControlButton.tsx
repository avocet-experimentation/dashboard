import ErrorBox from '#/components/helpers/ErrorBox';
import { Button } from '#/components/ui/button';
import { useAllFeatureFlags } from '#/hooks/query-hooks';
import {
  COMPLETE_EXPERIMENT,
  PAUSE_EXPERIMENT,
  START_EXPERIMENT,
} from '#/lib/experiment-queries';
import { gqlRequest } from '#/lib/graphql-queries';
import { Experiment, ExperimentDraft } from '@avocet/core';
import { useMutation } from '@tanstack/react-query';
import { OctagonX, Power } from 'lucide-react';
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
    () =>
      data && (isPending || !ExperimentDraft.isReadyToStart(experiment, data)),
    [experiment, data],
  );

  if (isError) return <ErrorBox error={error} />;

  return (
    <Button
      variant="solid"
      disabled={disabled || isPending}
      colorPalette="green"
      onClick={() => mutate()}
    >
      <Power />
      Start
    </Button>
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
