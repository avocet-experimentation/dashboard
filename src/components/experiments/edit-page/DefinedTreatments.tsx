import { Switch } from '#/components/ui/switch';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import { UPDATE_EXPERIMENT } from '#/lib/experiment-queries';
import { ALL_FEATURE_FLAGS } from '#/lib/flag-queries';
import { getRequestFunc } from '#/lib/graphql-queries';
import {
  Experiment,
  ExperimentDraft,
  FeatureFlag,
  FlagState,
  Treatment,
} from '@avocet/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  Editable,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { EditableGenerals } from '#/components/helpers/EditableGenerals';
import { Tooltip } from '#/components/ui/tooltip';
import { CircleAlert, CircleHelp, CirclePlus, Trash2 } from 'lucide-react';
import { useExperimentContext } from './ExperimentContext';
import { Button } from '#/components/ui/button';
import InfoWarning from '#/components/helpers/InfoWarning';

export default function DefinedTreatments() {
  const flagsQuery = useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: async () => getRequestFunc(ALL_FEATURE_FLAGS, {})(),
    placeholderData: [] as FeatureFlag[],
  });

  const { experiment, useUpdateExperiment } = useExperimentContext();
  // const { data: experiment } = useExperiment();
  const { mutate } = useUpdateExperiment();

  const getFlagDetails = (id: string) => {
    const flag = flagsQuery.data?.find((flag) => flag.id === id);
    return { name: flag?.name, type: flag?.value.type };
  };

  const defaultFlagValue = (
    type: 'string' | 'boolean' | 'number',
    value: string | number | boolean | undefined,
  ) => {
    if (value === undefined) {
      return type === 'string' ? 'Hello world' : '0';
    } else {
      return String(value);
    }
  };

  const handleAddTreatment = () => {
    const treatmentIds: string[] = Object.keys(experiment?.definedTreatments);
    const newTreatmentName = `Treatment ${treatmentIds.length + 1}`;
    let potentialFlags: FeatureFlag[] = [];
    if (treatmentIds.length) {
      const flagStates: FlagState[] =
        experiment?.definedTreatments[treatmentIds[0]].flagStates;
      if (flagStates.length) {
        const flagIds = flagStates.reduce(
          (accumulator: string[], flag: FeatureFlag) => {
            accumulator.push(flag.id);
            return accumulator;
          },
          [],
        );
        potentialFlags = flagsQuery.data?.filter((flag) =>
          flagIds.includes(flag.id),
        );
      }
    }
    ExperimentDraft.addTreatment(experiment, potentialFlags, newTreatmentName);
    mutate({ definedTreatments: experiment?.definedTreatments });
  };

  const handleDeleteTreatment = (treatmentId: string) => {
    experiment?.groups.forEach(
      (group) =>
        (group.sequence = group.sequence.filter((id) => id !== treatmentId)),
    );
    delete experiment?.definedTreatments[treatmentId];
    mutate({
      definedTreatments: experiment?.definedTreatments,
      groups: experiment?.groups,
    });
  };

  return (
    <Stack padding="15px" bg="avocet-section" borderRadius="5px" gap={4}>
      <Heading size="lg">
        <HStack gap={2.5}>
          Defined Treatments ({Object.keys(experiment.definedTreatments).length}
          ){' '}
          <Tooltip
            showArrow
            openDelay={50}
            content={
              'To add more feature flags to the treatments, select from the Linked Feature Flags section above.'
            }
          >
            <Icon size="md">
              <CircleHelp />
            </Icon>
          </Tooltip>
        </HStack>
      </Heading>
      {Object.keys(experiment?.definedTreatments).length === 0 ? (
        <InfoWarning message="No treatments have been defined for this experiment." />
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {Object.entries(experiment.definedTreatments).map(
            ([treatmentId, props]) => (
              <Stack
                key={treatmentId}
                padding="15px"
                border="1px solid"
                borderRadius="5px"
              >
                <Flex dir="row" justifyContent="space-between">
                  <EditableGenerals
                    fieldName={'Name'}
                    includeName={true}
                    defaultValue={props.name}
                    inputType="text"
                    onValueCommit={(e) => {
                      experiment.definedTreatments[treatmentId].name = e.value;
                      mutate({
                        definedTreatments: experiment.definedTreatments,
                      });
                    }}
                  />
                  <EditableGenerals
                    fieldName={'Duration'}
                    includeName={true}
                    defaultValue={String(props.duration)}
                    inputType="number"
                    onValueCommit={(e) => {
                      experiment.definedTreatments[treatmentId].duration =
                        Number(e.value);
                      mutate({
                        definedTreatments: experiment.definedTreatments,
                      });
                    }}
                  />
                </Flex>
                {!props.flagStates.length ? (
                  <InfoWarning message="No feature flags have been linked to this experiment." />
                ) : (
                  <>
                    <Box borderRadius="5px" overflow="hidden">
                      <Table.Root stickyHeader interactive bg="transparent">
                        <Table.Header>
                          <Table.Row bg="avocet-bg">
                            <Table.ColumnHeader>FEATURE</Table.ColumnHeader>
                            <Table.ColumnHeader>VALUE</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {props.flagStates.map(({ value, id }, featureIdx) => {
                            const { name, type } = getFlagDetails(id);
                            return (
                              <Table.Row key={id} bg="avocet-bg">
                                <Table.Cell>{name}</Table.Cell>
                                <Table.Cell>
                                  {type === 'boolean' ? (
                                    <Switch
                                      checked={Boolean(value)}
                                      onCheckedChange={({ checked }) => {
                                        props.flagStates[featureIdx].value =
                                          !!checked;
                                        mutate({
                                          definedTreatments:
                                            experiment.definedTreatments,
                                        });
                                      }}
                                    ></Switch>
                                  ) : (
                                    <Editable.Root
                                      activationMode="dblclick"
                                      defaultValue={defaultFlagValue(
                                        type,
                                        value,
                                      )}
                                      fontSize="inherit"
                                      onValueCommit={(e) => {
                                        props.flagStates[featureIdx].value =
                                          e.value;
                                        mutate({
                                          definedTreatments:
                                            experiment.definedTreatments,
                                        });
                                      }}
                                    >
                                      <Editable.Preview
                                        _hover={{ bg: 'avocet-hover' }}
                                      />
                                      <Editable.Input />
                                    </Editable.Root>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </>
                )}
                {Object.keys(experiment?.definedTreatments).length > 1 && (
                  <Button
                    marginLeft="auto"
                    width="fit-content"
                    onClick={() => handleDeleteTreatment(treatmentId)}
                  >
                    <Trash2 />
                    Delete Treatment
                  </Button>
                )}
              </Stack>
            ),
          )}
        </Grid>
      )}
      <Button
        width="fit-content"
        variant="plain"
        _hover={{
          color: 'avocet-plain-button-hover-color',
          bg: 'avocet-plain-button-hover-bg',
        }}
        onClick={handleAddTreatment}
      >
        <CirclePlus />
        Add Treatment
      </Button>
    </Stack>
  );
}
