import { useLocation, useRoute } from 'wouter';
import NotFound from '../../NotFound';
import {
  Box,
  EditableValueChangeDetails,
  Flex,
  Heading,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { Environment, Experiment, ExperimentDraft } from '@avocet/core';
import {
  StartExperimentButton,
  PauseExperimentButton,
  CompleteExperimentButton,
} from './ExperimentControlButton';
import LinkedFlagsSection from './LinkedFlagsSection';
import PageEditable from '#/components/forms/PageEditable';
import PageSelect from '#/components/forms/PageSelect';
import { getRequestFunc } from '#/lib/graphql-queries';
import { EXPERIMENT, UPDATE_EXPERIMENT } from '#/lib/experiment-queries';
import ErrorBox from '#/components/helpers/ErrorBox';
import Loader from '#/components/helpers/Loader';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tooltip } from '#/components/ui/tooltip';
import { Status } from '#/components/ui/status';
import { EXP_STATUS_LEGEND } from '#/lib/constants';
import DefinedTreatments from './DefinedTreatments';
import VariationGroupsSection from './VariationGroupsSection';
import ExperimentControlMenu from './ExperimentControlMenu';

export default function ExperimentManagementPage() {
  const [_match, params] = useRoute('/experiments/:id');

  if (params === null) {
    throw new Error(`No params passed!`);
  }

  if (typeof params.id !== 'string') {
    throw new Error(`id "${params?.id}" is not a string!`);
  }

  const { isPending, isError, error, data } = useQuery({
    queryKey: ['experiment', params.id],
    queryFn: getRequestFunc(EXPERIMENT, { id: params.id }),
  });

  if (isPending) return <Loader label="Loading experiment..." />;
  if (isError) return <ErrorBox error={error} />;
  if (data === null) {
    return <NotFound componentName="Experiment" />;
  }

  return <ExperimentManagementFields experiment={data} />;
}

/**
 * (WIP) Parent component for all editable fields
 * todo:
 * - tooltip on experiment start button to clarify what conditions are pending
 * - tooltips on experiment pause/complete buttons to warn users
 */
function ExperimentManagementFields({
  experiment,
}: {
  experiment: Experiment;
}) {
  const [, setLocation] = useLocation();

  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: getRequestFunc(ALL_ENVIRONMENTS, {}),
    placeholderData: [] as Environment[],
  });

  const { mutate } = useMutation({
    mutationKey: ['experiment', experiment.id],
    mutationFn: async (partialEntry: Partial<ExperimentDraft>) =>
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: { ...partialEntry, id: experiment.id },
      })(),
  });

  return (
    <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
      <Flex justifyContent="space-between">
        <Heading size="3xl">{experiment.name}</Heading>
        <HStack>
          <Tooltip
            showArrow
            openDelay={50}
            content={EXP_STATUS_LEGEND[experiment.status].description}
          >
            <Status colorPalette={EXP_STATUS_LEGEND[experiment.status].color}>
              {experiment.status}
            </Status>
          </Tooltip>
          {
            // TODO: show "Resume" label instead of "Start" for paused experiments
            (experiment.status === 'draft' ||
              experiment.status === 'paused') && (
              <StartExperimentButton experiment={experiment} />
            )
          }
          {experiment.status === 'active' && (
            <>
              <PauseExperimentButton experiment={experiment} />
              <CompleteExperimentButton experiment={experiment} />
            </>
          )}
          <ExperimentControlMenu
            experimentId={experiment.id}
            disabled={['active', 'paused'].includes(experiment.status)}
          />
        </HStack>
      </Flex>
      <Box>
        <Heading size="xl" marginBottom="15px">
          Overview
        </Heading>
        <Stack gap={4}>
          <PageEditable
            label="Description"
            initialValue={experiment.description ?? ''}
            submitHandler={async (e: EditableValueChangeDetails) => {
              mutate({ description: e.value });
            }}
          />
          <PageEditable
            label="Hypothesis"
            initialValue={experiment.hypothesis ?? ''}
            submitHandler={async (e: EditableValueChangeDetails) => {
              mutate({ hypothesis: e.value });
            }}
          />
          <PageSelect
            options={
              environmentsQuery.data?.map((env) => ({
                label: env.name,
                value: env.name,
              })) ?? []
            }
            label="Environment"
            selected={
              experiment.environmentName ? [experiment.environmentName] : []
            }
            handleValueChange={(selectedEnvIds) =>
              mutate({ environmentName: selectedEnvIds[0] })
            }
          />
        </Stack>
      </Box>
      <Box>
        <Heading size="xl" marginBottom="15px">
          Implementation
        </Heading>
        <Stack gap={4}>
          <LinkedFlagsSection experiment={experiment} />
          <DefinedTreatments experiment={experiment} />
          <VariationGroupsSection experiment={experiment} />
        </Stack>
      </Box>
    </Stack>
  );
}
