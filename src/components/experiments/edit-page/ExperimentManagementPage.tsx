import { ServicesContext } from '#/services/ServiceContext';
import { useLocation, useRoute } from 'wouter';
import NotFound from '../../NotFound';
import { useContext, useEffect, useState } from 'react';
import {
  Box,
  EditableValueChangeDetails,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../ui/menu';
import { EllipsisVertical, Link, Trash2 } from 'lucide-react';
import {
  Environment,
  Experiment,
  ExperimentDraft,
  FeatureFlag,
} from '@avocet/core';
import VariationGroups from './VariationGroupsSection';
import {
  StartExperimentButton,
  PauseExperimentButton,
} from './ExperimentControlButton';
import LinkedFlagsSection from './LinkedFlagsSection';
import PageEditable from '#/components/forms/PageEditable';
import PageSelect from '#/components/forms/PageSelect';
import { ExperimentContext } from '../ExperimentContext';

export default function ExperimentManagementPage() {
  const { isLoading, setIsLoading } = useContext(ExperimentContext);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>();
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [availableFlags, setAvailableFlags] = useState<FeatureFlag[]>([]);
  const [match, params] = useRoute('/experiments/:id');
  const [location, setLocation] = useLocation();
  const services = useContext(ServicesContext);

  if (params === null) {
    throw new Error("Missing 'id' param!");
  }

  useEffect(() => {
    const handleGetExperiment = async () => {
      if (params) {
        try {
          const response = await services.experiment.get(params.id);
          if (response.ok) {
            setExperiment(response.body);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    };

    handleGetExperiment();
    services.environment
      .getMany()
      .then((response) => setEnvironments(response.body));
  }, []);

  useEffect(() => {
    const fetchFlags = async () => {
      if (experiment === null) return;
      const response = await services.featureFlag.getAll();
      if (!response.ok) {
        return;
      }

      setFeatureFlags(response.body);
      const inEnvironment = response.body.filter(
        (flag) => experiment.environmentName in flag.environmentNames,
      );
      setAvailableFlags(inEnvironment);
    };

    fetchFlags();
  }, [experiment]);

  const handleExperimentUpdate = async (
    updates: Partial<ExperimentDraft>,
  ): Promise<boolean> => {
    const expResponse = await services.experiment.update(params.id, updates);

    return expResponse.ok;
  };

  const handleDeleteClick = async () => {
    if (!experiment) return;
    const response = await services.experiment.delete(experiment.id);
    if (response.ok) {
      setLocation('/experiments');
    } else {
      // todo: handle failed deletion
    }
  };

  if (isLoading) return <></>;
  // todo: replace outer box with LoaderWrapper
  return (
    <Box>
      {experiment ? (
        <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
          <Flex justifyContent="space-between">
            <Heading size="3xl">{experiment.name}</Heading>
            <HStack>
              {experiment.status === 'draft' ? (
                <StartExperimentButton
                  disabled={
                    !!ExperimentDraft.isReadyToStart(experiment, featureFlags)
                  }
                  experimentId={experiment.id}
                />
              ) : (
                <PauseExperimentButton experimentId={experiment.id} />
              )}
              {/* <ExperimentControlButton
                experiment={experiment}
                experimentService={services.experiment}
              /> */}
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton size="md">
                    <EllipsisVertical color="black" />
                  </IconButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem
                    value="delete"
                    valueText="Delete"
                    cursor="pointer"
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                    onClick={handleDeleteClick}
                  >
                    <Trash2 />
                    <Box flex="1">Delete</Box>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
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
                  const success = await handleExperimentUpdate({
                    description: e.value,
                  });
                  return success ? e.value : (experiment.description ?? '');
                }}
              />
              <PageEditable
                label="Hypothesis"
                initialValue={experiment.hypothesis ?? ''}
                submitHandler={async (e: EditableValueChangeDetails) => {
                  const success = await handleExperimentUpdate({
                    hypothesis: e.value,
                  });
                  return success ? e.value : (experiment.hypothesis ?? '');
                }}
              />
              {environments && (
                <PageSelect
                  options={environments.map((env) => ({
                    label: env.name,
                    value: env.name,
                  }))}
                  label="Environment"
                  selected={
                    experiment.environmentName
                      ? [experiment.environmentName]
                      : []
                  }
                  handleValueChange={(selectedEnvIds) =>
                    handleExperimentUpdate({
                      environmentName: selectedEnvIds[0],
                    })
                  }
                />
              )}
            </Stack>
          </Box>
          <Box>
            <Heading size="xl" marginBottom="15px">
              Implementation
            </Heading>
            <Stack gap={4}>
              <VariationGroups experiment={experiment} />
              <Stack padding="15px" bg="white" borderRadius="5px">
                <Flex justifyContent="space-between">
                  <Heading size="lg">
                    Linked Feature Flags ({experiment.flagIds.length})
                  </Heading>
                  {/* <FormModal
                    triggerButtonIcon={<Link />}
                    triggerButtonText={'Link Feature Flag'}
                    title={`Link Feature to ${experiment.name}`}
                    formId={LINK_FEATURE_FORM}
                    confirmButtonText={'Link'}
                  >
                    <LinkFeatureForm
                      formId={LINK_FEATURE_FORM}
                      setIsLoading={undefined}
                    />
                  </FormModal> */}
                </Flex>
                <PageSelect
                  width="100%"
                  multiple={true}
                  placeholder="select flags"
                  options={availableFlags.map((flag) => ({
                    label: flag.name,
                    value: flag.id,
                  }))}
                  selected={availableFlags
                    .filter((flag) => experiment.flagIds.includes(flag.id))
                    .map((flag) => flag.id)}
                  handleValueChange={(selectedFlagIds) => {
                    console.log({ selectedFlagId: selectedFlagIds });
                    const flag = availableFlags.find((flag) =>
                      selectedFlagIds.includes(flag.id),
                    );
                    if (!flag) return;
                    const update = ExperimentDraft.addFlag(
                      structuredClone(experiment),
                      flag,
                    );
                    handleExperimentUpdate(update);
                  }}
                />
                <LinkedFlagsSection experiment={experiment} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <NotFound componentName={'experiment'} />
      )}
    </Box>
  );
}
