import {
  Box,
  createListCollection,
  HStack,
  Input,
  ListCollection,
  Stack,
  Table,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { FeatureFlag, Treatment } from '@avocet/core';
import { ServicesContext } from '#/services/ServiceContext';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '#/components/ui/select';
import { Field } from '#/components/ui/field';
import TreatmentFeatureValueType from './TreatmentFeatureValueType';
import FlagCountButtons from './FlagCountButtons';
import ControlledSelect from '#/components/forms/ControlledSelect';
import { ExperimentContext } from '../ExperimentContext';

// export interface FeatureFlagCollection {
//   /** Flag name */
//   label: string;
//   /** flag ID */
//   value: string;
//   type: 'string' | 'number' | 'boolean';
//   initial: string | number | boolean;
// }
// const createFeatureFlagCollection = (features: FeatureFlag[]) => {
//   const items: FeatureFlagCollection[] = features.map((feature) => ({
//     label: feature.name,
//     value: feature.id,
//     type: feature.value.type,
//     initial: feature.value.initial,
//   }));
//   return createListCollection({ items });
// };

export default function ExperimentTreatmentField() {
  const services = useContext(ServicesContext);
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext();
  const definedTreatments: Record<string, Treatment> =
    watch('definedTreatments');

  const { featureFlags } = useContext(ExperimentContext);
  const flagOptions = featureFlags.map((flag) => ({
    label: flag.name,
    value: flag.id,
  }));

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
  // treatmentIdx: number;
}

function TreatmentRow({
  featureIdx,
  flagOptions,
  treatmentId,
  // treatmentIdx,
}: TreatmentRowProps) {
  const { featureFlags } = useContext(ExperimentContext);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag>();
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
        {/* <Field>
          <Controller
            control={control}
            name={`definedTreatments.${treatmentId}.flagStates.${featureIdx}.id`}
            render={({ field }) => (
              <SelectRoot
                collection={flagOptions}
                disabled={treatmentIdx > 0}
                onValueChange={({ value }) => {
                  field.onChange(value[0]);
                  setValue(
                    `definedTreatments.${treatmentId}.flagStates.${featureIdx}.id`,
                    value[0],
                  );
                  setSelectedFlagId(value[0]);
                }}
              >
                <SelectTrigger>
                  <SelectValueText
                    placeholder={
                      field.value && 'items' in flagOptions
                        ? flagOptions.items.find(
                            (flag) => flag.value === field.value,
                          )?.label
                        : 'Select feature...'
                    }
                  />
                </SelectTrigger>
                <SelectContent zIndex="popover">
                  {flagOptions.items.map((feature) => (
                    <SelectItem item={feature} key={feature.value}>
                      {feature.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field> */}
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
