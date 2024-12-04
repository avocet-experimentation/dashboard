import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react';
import { Field } from '../ui/field';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';
import { CircleEqual, CirclePlus } from 'lucide-react';
import { ExperimentGroup, Treatment, idMap } from '@estuary/types';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';

const createFeatureCollection = (features) => {
  const items = features.map((feature) => {
    return { label: feature.name, value: feature.id };
  });
  return createListCollection({ items });
};

const checkInCollection = (data, criteriaArray, property) => {
  return data.filter((item) =>
    criteriaArray.some((criteria) => criteria['value'] === item[property]),
  );
};

const appendedGroup = (index: number): ExperimentGroup => {
  return {
    id: '',
    name: `Group ${index + 1}`,
    proportion: 0,
    cycles: 1,
    sequence: [],
  };
};

const setEqualProportions = (
  fields: Omit<ExperimentGroup, 'id'>[],
  fieldArrayUpdate,
): void => {
  const numOfVariations: number = fields.length;
  const split: number = Math.trunc((1 / numOfVariations) * 10000) / 10000;
  let remainder = 1 - split * numOfVariations;
  fields.forEach((_, index) => {
    let refinedSplit = split;
    if (remainder > 0) {
      refinedSplit += 0.0001;
      remainder -= 0.0001;
    }
    fieldArrayUpdate(index, {
      ...fields[index],
      proportion: refinedSplit,
    });
  });
};

const ExpTypeForm = ({
  control,
  createTreatmentCollection,
  definedTreatments,
  errors,
  expType,
  featuresCollection,
  groupValues,
  setValue,
  register,
}) => {
  const {
    fields: groupFields,
    append: addGroup,
    remove: removeGroup,
    update: updateGroup,
  } = useFieldArray({
    control,
    name: 'groups',
  });
  const [appendFunctions, setAppendFunctions] = useState({});
  const [treatmentFeatures, setTreatmentFeatures] = useState({});

  useEffect(() => {}, [treatmentFeatures]);

  return (
    <>
      <Field label={`Treatments (${Object.keys(definedTreatments).length})`}>
        <Box maxHeight="250px" overflowY="auto" width="100%">
          {Object.entries(definedTreatments).map(
            ([id, treatment], treatmentIdx) => {
              const {
                fields: treatmentFeatures,
                append: addFeature,
                remove: removeFeature,
                update: updateFeature,
              } = useFieldArray({
                control,
                name: `definedTreatments.${id}.flagStates`,
              });
              if (!treatmentFeatures.length) {
                addFeature({});
              }
              if (!appendFunctions[id]) {
                setAppendFunctions((prevState) => ({
                  ...prevState,
                  [id]: addFeature,
                }));
              }
              return (
                <Stack
                  key={id + String(treatmentIdx)}
                  padding={'15px 15px'}
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
                      errorText={
                        errors.definedTreatments?.[id]?.duration?.message
                      }
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
                      {treatmentFeatures.map((_, featureIdx) => {
                        return (
                          <Table.Row key={id + String(featureIdx)}>
                            <Table.Cell>
                              <Field>
                                <Controller
                                  control={control}
                                  name={`definedTreatments.${id}.flagStates.${featureIdx}.id`}
                                  render={({ field }) => {
                                    return (
                                      <SelectRoot
                                        collection={featuresCollection}
                                        disabled={treatmentIdx > 0}
                                        onValueChange={({ value }) => {
                                          field.onChange(value[0]);
                                          Object.keys(
                                            definedTreatments,
                                          ).forEach((id) => {
                                            setValue(
                                              `definedTreatments.${id}.flagStates.${featureIdx}.id`,
                                              value[0],
                                            );
                                          });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValueText
                                            placeholder={
                                              !field.value
                                                ? 'Select feature...'
                                                : featuresCollection.items.find(
                                                    (feature) =>
                                                      feature.value ===
                                                      field.value,
                                                  )['label']
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent zIndex="popover">
                                          {featuresCollection.items.map(
                                            (feature) => (
                                              <SelectItem
                                                item={feature}
                                                key={feature.value}
                                              >
                                                {feature.label}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </SelectRoot>
                                    );
                                  }}
                                />
                              </Field>
                            </Table.Cell>
                            <Table.Cell>
                              <Controller
                                name={`definedTreatments.${id}.flagStates.${featureIdx}.value`}
                                control={control}
                                render={({ field }) => {
                                  const selectedFeatureId =
                                    definedTreatments[id]['flagStates'][
                                      featureIdx
                                    ]['id'];
                                  if (selectedFeatureId) {
                                    const selectedFeature =
                                      featuresCollection.items.find(
                                        (featObj) =>
                                          featObj.value === selectedFeatureId,
                                      );
                                    if (selectedFeature.type === 'boolean')
                                      return (
                                        <Switch
                                          id={id + "." + selectedFeatureId}
                                          key={id + "." + selectedFeatureId}
                                          name={field.name}
                                          checked={!!field.value}
                                          onCheckedChange={({ checked }) => {
                                            return field.onChange(!!checked);
                                          }}
                                          inputProps={{ onBlur: field.onBlur }}
                                        >
                                          {!!field.value ? 'on' : 'off'}
                                        </Switch>
                                      );
                                    if (selectedFeature.type === 'string')
                                      return (
                                        <Input
                                          type="text"
                                          placeholder="A string value"
                                          {...register(
                                            `definedTreatments.${id}.flagStates.${featureIdx}.value`,
                                            {
                                              required:
                                                'A string value is required.',
                                            },
                                          )}
                                        />
                                      );
                                    if (selectedFeature.type === 'number')
                                      return (
                                        <Input
                                          type="number"
                                          placeholder="A number value"
                                          {...register(
                                            `definedTreatments.${id}.flagStates.${featureIdx}.value`,
                                            {
                                              valueAsNumber: true,
                                              required:
                                                'A number value is required.',
                                            },
                                          )}
                                        />
                                      );
                                  }
                                  return <></>;
                                }}
                              />
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Stack>
              );
            },
          )}
        </Box>
        <Button
          border="0px"
          variant="plain"
          background="transparent"
          _hover={{ backgroundColor: 'transparent', color: 'blue' }}
          onClick={() => {
            Object.values(appendFunctions).forEach((append) => append({}));
          }}
        >
          <CirclePlus />
          Add new feature
        </Button>
      </Field>
      <Controller
        name="groups"
        control={control}
        render={({ field }) => (
          <Field
            label={`Groups (${groupFields.length})`}
            invalid={!!errors.value?.length}
            errorText={errors.value?.[0]?.message}
          >
            <Box maxHeight="250px" overflowY="auto" width="100%">
              <Table.Root stickyHeader interactive>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>TREATMENT</Table.ColumnHeader>
                    <Table.ColumnHeader>NAME</Table.ColumnHeader>
                    <Table.ColumnHeader>SPLIT</Table.ColumnHeader>
                    <Table.ColumnHeader>CYCLES</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {groupFields.map((field, index) => {
                    return (
                      <Table.Row key={field.id + String(index)}>
                        <Table.Cell>
                          <Field>
                            <SelectRoot
                              disabled={expType === 'switchback'}
                              collection={createTreatmentCollection(
                                definedTreatments,
                              )}
                              onValueChange={({ value }) => {
                                const {
                                  fields: sequence,
                                  append: addToSequence,
                                  replace: replaceInSequence,
                                } = useFieldArray({
                                  control,
                                  name: `groups.${index}.sequence`,
                                });

                                !sequence.length
                                  ? addToSequence(value)
                                  : replaceInSequence(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValueText
                                  placeholder={
                                    expType === 'ab'
                                      ? 'Select treatment...'
                                      : 'ALL'
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent zIndex="popover">
                                {createTreatmentCollection(
                                  definedTreatments,
                                ).items.map((treatment) => (
                                  <SelectItem
                                    item={treatment}
                                    key={treatment.value}
                                  >
                                    {treatment.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </SelectRoot>
                          </Field>
                        </Table.Cell>
                        <Table.Cell>
                          <Field
                            invalid={!!errors.groups?.[index]?.name}
                            errorText={errors.groups?.[index]?.name?.message}
                          >
                            <Input
                              border="0px"
                              width="125px"
                              defaultValue={field.name || `Variation ${index}`}
                              {...register(`groups.${index}.name`, {
                                required: 'Name is required.',
                                validate: {
                                  unique: (name) =>
                                    groupValues.filter((n) => n.name === name)
                                      .length === 1 ||
                                    'Group names must be unique.',
                                },
                              })}
                            />
                          </Field>
                        </Table.Cell>
                        <Table.Cell>
                          <Field
                            invalid={!!errors.groups?.[index]?.proportion}
                            errorText={
                              errors.groups?.[index]?.proportion?.message
                            }
                          >
                            <Input
                              border="0px"
                              width="75px"
                              defaultValue={field.proportion || 0}
                              disabled={expType === 'switchback'}
                              {...register(`groups.${index}.proportion`, {
                                required: 'Group proportion is required.',
                                valueAsNumber: true,
                                min: {
                                  value: 0,
                                  message: '>= 0',
                                },
                                max: {
                                  value: 1,
                                  message: '<= 1',
                                },
                                validate: {
                                  sumToOne: () => 
                                    groupValues.reduce((acc: number, { proportion }) => {return acc + proportion}, 0) === 1 ||
                                    'Group proportions must sum to 1.'
                                }
                              })}
                            />
                          </Field>
                        </Table.Cell>
                        <Table.Cell>
                          <Field
                            invalid={!!errors.groups?.[index]?.cycles}
                            errorText={errors.groups?.[index]?.cycles?.message}
                          >
                            <Input
                              border="0px"
                              width="75px"
                              defaultValue={1}
                              disabled={expType === 'ab'}
                              {...register(`groups.${index}.cycles`, {
                                required: 'Group number of cycles is required.',
                                valueAsNumber: true,
                                min: {
                                  value: 1,
                                  message: '>= 1',
                                },
                              })}
                            />
                          </Field>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>

            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Button
                border="0px"
                variant="plain"
                background="transparent"
                _hover={{ backgroundColor: 'transparent', color: 'blue' }}
                onClick={() => {
                  const newTreatment = new Treatment.template({ name: '' });
                  const treatmentObj = idMap([newTreatment]);
                  setValue('definedTreatments', {
                    ...definedTreatments,
                    treatmentObj,
                  });
                  addGroup(appendedGroup(groupFields.length));
                }}
              >
                <CirclePlus />
                {expType === 'ab'
                  ? 'Add new group/treatment'
                  : 'Add new treatment'}
              </Button>
              {expType === 'ab' && (
                <Button
                  border="0px"
                  variant="plain"
                  background="transparent"
                  _hover={{ backgroundColor: 'transparent', color: 'blue' }}
                  onClick={() => setEqualProportions(groupFields, updateGroup)}
                >
                  <CircleEqual />
                  Set equal proportions
                </Button>
              )}
            </Flex>
          </Field>
        )}
      />
    </>
  );
};

export default ExpTypeForm;
