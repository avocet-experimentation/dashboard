import { Switch } from '#/components/ui/switch';
import { toastError, toastSuccess } from '#/components/ui/toaster';
import { UPDATE_EXPERIMENT } from '#/lib/experiment-queries';
import { ALL_FEATURE_FLAGS } from '#/lib/flag-queries';
import { getRequestFunc } from '#/lib/graphql-queries';
import { Experiment, FeatureFlag, Treatment } from '@avocet/core';
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
} from '@chakra-ui/react';
import { EditableGenerals } from './EditableGenerals';
import { Tooltip } from '#/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

export default function DefinedTreatments({
  experiment,
}: {
  experiment: Experiment;
}) {
  const flagsQuery = useQuery({
    queryKey: ['allFeatureFlags'],
    queryFn: async () => getRequestFunc(ALL_FEATURE_FLAGS, {})(),
    placeholderData: [] as FeatureFlag[],
  });

  const { mutate } = useMutation({
    mutationFn: async (definedTreatment: Record<string, Treatment>) => {
      getRequestFunc(UPDATE_EXPERIMENT, {
        partialEntry: {
          definedTreatments: definedTreatment,
          id: experiment.id,
        },
      })();
    },
    mutationKey: ['experiment', experiment.id],
    onSuccess: () => {
      toastSuccess('Experiment updated successfully.');
    },
    onError: () => {
      toastError('Could not update the experiment at this time.');
    },
  });

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

  return (
    <Stack padding="15px" bg="white" borderRadius="5px">
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
                    mutate(experiment.definedTreatments);
                  }}
                />
                <EditableGenerals
                  fieldName={'Duration'}
                  includeName={true}
                  defaultValue={String(props.duration)}
                  inputType="number"
                  onValueCommit={(e) => {
                    experiment.definedTreatments[treatmentId].duration = Number(
                      e.value,
                    );
                    mutate(experiment.definedTreatments);
                  }}
                />
              </Flex>
              <Table.Root stickyHeader interactive bg="transparent">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>FEATURE</Table.ColumnHeader>
                    <Table.ColumnHeader>VALUE</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {props.flagStates.map(({ value, id }, featureIdx) => {
                    const { name, type } = getFlagDetails(id);
                    return (
                      <Table.Row key={id}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>
                          {type === 'boolean' ? (
                            <Switch
                              checked={Boolean(value)}
                              onCheckedChange={({ checked }) => {
                                props.flagStates[featureIdx].value = !!checked;
                                mutate(experiment.definedTreatments);
                              }}
                            ></Switch>
                          ) : (
                            <Editable.Root
                              activationMode="dblclick"
                              defaultValue={defaultFlagValue(type, value)}
                              fontSize="inherit"
                              onValueCommit={(e) => {
                                props.flagStates[featureIdx].value = e.value;
                                mutate(experiment.definedTreatments);
                              }}
                            >
                              <Editable.Preview />
                              <Editable.Input />
                            </Editable.Root>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Stack>
          ),
        )}
      </Grid>
    </Stack>
  );
}
