import { Box, HStack, Input, Stack, Table } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { FeatureFlag, Treatment } from '@avocet/core';
import { Field } from '#/components/ui/field';
import TreatmentFeatureValueType from './TreatmentFeatureValueType';
import FlagCountButtons from './FlagCountButtons';
import ControlledSelect from '#/components/forms/ControlledSelect';
import { useAllFeatureFlags } from '#/hooks/query-hooks';

export default function ExperimentTreatmentField() {
  const { watch } = useFormContext();
  const definedTreatments: Record<string, Treatment> =
    watch('definedTreatments');

  const allFlagsQuery = useAllFeatureFlags();

  const flagOptions =
    allFlagsQuery.data?.allFeatureFlags.map((flag) => ({
      label: flag.name,
      value: flag.id,
    })) ?? [];

  return (
    <Field label={`Treatments (${Object.keys(definedTreatments).length})`}>
      <Box minHeight="250px" maxHeight="50vh" overflowY="auto" width="100%">
        {Object.entries(definedTreatments).map(
          ([id, treatment], treatmentIdx) => (
            <TreatmentFlagStates
              key={id}
              flagOptions={flagOptions}
              treatment={treatment}
              treatmentIdx={treatmentIdx}
            />
          ),
        )}
      </Box>
      <FlagCountButtons />
    </Field>
  );
}

interface TreatmentRowProps {
  featureIdx?: number;
  flagOptions: { label: string; value: string }[];
  treatmentId: string;
}

function TreatmentRow({
  featureIdx,
  flagOptions,
  treatmentId,
}: TreatmentRowProps) {
  const allFlagsQuery = useAllFeatureFlags();
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag>();

  const featureFlags = allFlagsQuery.data?.allFeatureFlags ?? [];
  const flagStatePath = `definedTreatments.${treatmentId}.flagStates.${featureIdx}`;

  return (
    <Table.Row>
      <Table.Cell>
        <ControlledSelect
          fieldPath={`${flagStatePath}.id`}
          options={flagOptions}
          handleValueChange={(value) =>
            setSelectedFlag(featureFlags.find((flag) => flag.id === value))
          }
        />
      </Table.Cell>
      <Table.Cell>
        {featureIdx && selectedFlag && (
          <TreatmentFeatureValueType
            featureIdx={featureIdx}
            selectedFlag={selectedFlag}
            treatmentId={treatmentId}
          />
        )}
      </Table.Cell>
    </Table.Row>
  );
}

interface TreatmentFlagStatesProps {
  flagOptions: { label: string; value: string }[];
  treatment: Treatment;
  treatmentIdx: number;
}

function TreatmentFlagStates({
  flagOptions,
  treatment,
  treatmentIdx,
}: TreatmentFlagStatesProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { id } = treatment;

  return (
    <Stack
      key={id + String(treatmentIdx)}
      padding="15px 15px"
      border="solid 1px grey"
      borderRadius="5px"
    >
      <HStack>
        <Field
          orientation="horizontal"
          label="Name"
          invalid={!!(errors.definedTreatments?.[id]?.name as string)}
          errorText={errors.definedTreatments?.[id]?.name?.message as string}
        >
          <Input
            flex="1"
            defaultValue={treatment.name}
            {...register(`definedTreatments.${id}.name`, {
              required: 'Treatment name is required.',
            })}
          />
        </Field>
        <Field
          label="Duration"
          orientation="horizontal"
          invalid={!!errors.definedTreatments?.[id]?.duration}
          errorText={errors.definedTreatments?.[id]?.duration?.message}
        >
          <Input
            flex="1"
            defaultValue={treatment.duration}
            {...register(`definedTreatments.${id}.duration`, {
              required: 'Treatment duration is required.',
              valueAsNumber: true,
              min: {
                value: 0,
                message: '>= 0',
              },
            })}
          />
        </Field>
      </HStack>
      <Table.Root stickyHeader interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>FEATURE</Table.ColumnHeader>
            <Table.ColumnHeader>VALUE</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {treatment.flagStates.map(({}, featureIdx) => (
            <TreatmentRow
              featureIdx={featureIdx}
              flagOptions={flagOptions}
              treatmentId={id}
              // treatmentIdx={treatmentIdx}
              key={id + String(featureIdx)}
            />
          ))}
          <TreatmentRow flagOptions={flagOptions} treatmentId={id} />
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
