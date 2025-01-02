import ErrorBox from '#/components/helpers/ErrorBox';
import { Button } from '#/components/ui/button';
import {
  COMPLETE_EXPERIMENT,
  PAUSE_EXPERIMENT,
  START_EXPERIMENT,
} from '#/lib/experiment-queries';
import {
  ALL_FEATURE_FLAGS,
  getRequestFunc,
  gqlRequest,
} from '#/lib/graphql-queries';
import { Experiment, ExperimentDraft } from '@avocet/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { OctagonX, Power } from 'lucide-react';
import { useMemo } from 'react';

export function StartExperimentButton({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: getRequestFunc(ALL_FEATURE_FLAGS, {}),
  });

  if (isError) return <ErrorBox error={error} />;

  const { mutate } = useMutation({
    mutationFn: async () => gqlRequest(START_EXPERIMENT, { id: experiment.id }),
    mutationKey: ['experiment', experiment.id],
  });

  const disabled = useMemo(
    () => isPending || !ExperimentDraft.isReadyToStart(experiment, data),
    [experiment, data],
  );

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
      <OctagonX />
      Complete
    </Button>
  );
}
