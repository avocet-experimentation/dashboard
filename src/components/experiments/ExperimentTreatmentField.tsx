import {
  Box,
  createListCollection,
  HStack,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { FeatureFlag } from '@estuary/types';
import { ServicesContext } from '#/services/ServiceContext';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';
import { Field } from '../ui/field';
import TreatmentFeatureValueType from './TreatmentFeatureValueType';
import FeatureCountButtons from './FeatureCountButtons';

export interface FeatureCollection {
  label: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  initial: string | number | boolean;
}

const createFeatureCollection = (features: FeatureFlag[]) => {
  const items: FeatureCollection[] = features.map((feature) => ({
    label: feature.name,
    value: feature.id,
    type: feature.value.type,
    initial: feature.value.initial,
  }));
  return createListCollection({ items });
};

const checkInCollection = (data, criteriaArray, property) =>
  data.filter((item) =>
    criteriaArray.some((criteria) => criteria.value === item[property]),
  );

function ExperimentTreatmentField({ definedTreatments }) {
  const services = useContext(ServicesContext);
  const { control, formState, register, setValue } = useFormContext();
  const { errors } = formState;

  const [featuresCollection, setFeaturesCollection] = useState(
    createListCollection<FeatureCollection>({ items: [] }),
  );

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const allFeatures = await services.featureFlag.getAllFeatures();
        if (allFeatures.ok) {
          setFeaturesCollection(createFeatureCollection(allFeatures.body));
        }
        // setFeaturesCollection(
        //   allFeatures.ok
        //     ? createFeatureCollection(await allFeatures.body)
        //     : null,
        // );
      } catch (error) {
        console.log(error);
      }
    };

    handleGetAllFeatures();
  }, []);

  return (
    <Field label={`Treatments (${Object.keys(definedTreatments).length})`}>
      <Box minHeight="250px" maxHeight="50vh" overflowY="auto" width="100%">
        {Object.entries(definedTreatments).map(
          ([id, treatment], treatmentIdx) => (
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
                  invalid={!!errors.definedTreatments?.[id]?.name}
                  errorText={errors.definedTreatments?.[id]?.name?.message}
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
                  {definedTreatments[id].flagStates.map(({}, featureIdx) => (
                    <Table.Row key={id + String(featureIdx)}>
                      <Table.Cell>
                        <Field>
                          <Controller
                            control={control}
                            name={`definedTreatments.${id}.flagStates.${featureIdx}.id`}
                            render={({ field }) => (
                              <SelectRoot
                                collection={featuresCollection}
                                disabled={treatmentIdx > 0}
                                onValueChange={({ value }) => {
                                  field.onChange(value[0]);
                                  Object.keys(definedTreatments).forEach(
                                    (treatmentId) => {
                                      setValue(
                                        `definedTreatments.${treatmentId}.flagStates.${featureIdx}.id`,
                                        value[0],
                                      );
                                    },
                                  );
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValueText
                                    placeholder={
                                      !field.value
                                        ? 'Select feature...'
                                        : featuresCollection.items.find(
                                            (feature) =>
                                              feature.value === field.value,
                                          ).label
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent zIndex="popover">
                                  {featuresCollection.items.map((feature) => (
                                    <SelectItem
                                      item={feature}
                                      key={feature.value}
                                    >
                                      {feature.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </SelectRoot>
                            )}
                          />
                        </Field>
                      </Table.Cell>
                      <Table.Cell>
                        <TreatmentFeatureValueType
                          definedTreatments={definedTreatments}
                          featuresCollection={featuresCollection}
                          featureIdx={featureIdx}
                          id={id}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Stack>
          ),
        )}
      </Box>
      <FeatureCountButtons definedTreatments={definedTreatments} />
    </Field>
  );
}

export default ExperimentTreatmentField;
