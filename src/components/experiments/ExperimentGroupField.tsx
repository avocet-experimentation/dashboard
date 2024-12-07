import { Box, createListCollection, Input, Table } from '@chakra-ui/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Treatment } from '@estuary/types';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';
import { Field } from '../ui/field';
import { DefinedTreatments, ExperimentType } from './ExperimentForm';
import GroupCountButtons from './GroupCountButtons';

interface Props {
  expType: ExperimentType;
  definedTreatments: DefinedTreatments;
}

const createTreatmentCollection = (definedTreatments: Treatment) => {
  const items = Object.entries(definedTreatments).map(([id, treatment]) => ({
    label: treatment.name,
    value: id,
  }));
  return createListCollection({ items });
};

export default function ExperimentGroupField({
  expType,
  definedTreatments,
}: Props) {
  const { control, formState, register, setValue, watch } = useFormContext();
  const { errors } = formState;

  const groupValues = watch('groups');

  const {
    fields: groupFields,
    append: addGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: 'groups',
  });

  return (
    <Controller
      name="groups"
      control={control}
      render={() => (
        <Field
          label={`Groups (${groupFields.length})`}
          invalid={!!errors.value?.length}
          errorText={errors.value?.[0]?.message}
        >
          <Box minHeight="250px" maxHeight="50vh" overflowY="auto" width="100%">
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
                {groupFields.map((group, index) => (
                  <Table.Row key={group.id + String(index)}>
                    <Table.Cell>
                      <Field>
                        <SelectRoot
                          disabled={expType === 'switchback'}
                          collection={createTreatmentCollection(
                            definedTreatments,
                          )}
                          onValueChange={({ value }) => {
                            setValue(`groups.${index}.sequence`, value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValueText
                              placeholder={
                                expType === 'ab'
                                  ? group.sequence.length
                                    ? definedTreatments[group.sequence[0]].name
                                    : 'Select treatment...'
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
                          defaultValue={group.name || `Variation ${index}`}
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
                        errorText={errors.groups?.[index]?.proportion?.message}
                      >
                        <Input
                          border="0px"
                          width="75px"
                          defaultValue={group.proportion || 0}
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
                                groupValues.reduce(
                                  (
                                    acc: number,
                                    { proportion }: { proportion: number },
                                  ) => acc + proportion * 10000,
                                  0,
                                ) === 10000 ||
                                'Group proportions must sum to 1.',
                            },
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
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <GroupCountButtons
            addGroup={addGroup}
            definedTreatments={definedTreatments}
            expType={expType}
            groupFields={groupFields}
            groupValues={groupValues}
            removeGroup={removeGroup}
          />
        </Field>
      )}
    />
  );
}
