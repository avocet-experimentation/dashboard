import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Table,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Controller, useFieldArray } from "react-hook-form";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { CircleEqual, CirclePlus } from "lucide-react";
import { ExperimentGroup } from "@estuary/types";

const appendedGroup = (index: number): ExperimentGroup => {
  return {
    id: "",
    name: `Group ${index + 1}`,
    proportion: 0,
    cycles: 1,
    sequence: [],
  };
};

const setEqualProportions = (
  fields: ExperimentGroup[],
  fieldArrayUpdate
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

const ABSubForm = ({
  control,
  createTreatmentCollection,
  definedTreatments,
  errors,
  features,
  groupValues,
  register,
}) => {
  const {
    fields: groupFields,
    append: addGroup,
    remove: removeGroup,
    update: updateGroup,
  } = useFieldArray({
    control,
    name: "groups",
  });

  return (
    <>
      <Field label={"Treatments"}>
        <Box maxHeight="250px" overflowY="auto" width="100%">
          {Object.entries(definedTreatments).map(([id, treatment]) => (
            <Stack
              padding={"15px 15px"}
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
                      required: "Treatment name is required.",
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
                      required: "Treatment duration is required.",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: ">= 0",
                      },
                    })}
                  />
                </Field>
              </HStack>
              <Table.Root stickyHeader interactive>
                {/* <Table.ColumnGroup>
                <Table.Column htmlWidth="45%" />
                <Table.Column htmlWidth="45%" />
                <Table.Column htmlWidth="10%" />
              </Table.ColumnGroup> */}
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>FEATURE</Table.ColumnHeader>
                    <Table.ColumnHeader>VALUE</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row key={id}>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Stack>
          ))}
        </Box>
      </Field>
      <Controller
        name="groups"
        control={control}
        render={({ field }) => (
          <Field
            label={"Groups"}
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
                    <Table.ColumnHeader>Cycles</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {groupFields.map((field, index) => (
                    <Table.Row key={field.id}>
                      <Table.Cell>
                        <Field>
                          <SelectRoot
                            collection={createTreatmentCollection(
                              definedTreatments
                            )}
                          >
                            <SelectTrigger>
                              <SelectValueText placeholder="Select treatment..." />
                            </SelectTrigger>
                            <SelectContent zIndex="popover">
                              {createTreatmentCollection(
                                definedTreatments
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
                              required: "Name is required.",
                              validate: {
                                unique: (name) =>
                                  groupValues.filter((n) => n.name === name)
                                    .length === 1 ||
                                  "Group names must be unique.",
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
                            disabled={false}
                            {...register(`groups.${index}.proportion`, {
                              required: "Group proportion is required.",
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: ">= 0",
                              },
                              max: {
                                value: 1,
                                message: "<= 1",
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
                            disabled={true}
                            {...register(`groups.${index}.cycles`, {
                              required: "Group number of cycles is required.",
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message: ">= 1",
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
                _hover={{ backgroundColor: "transparent", color: "blue" }}
                onClick={() => addGroup(appendedGroup(groupFields.length))}
              >
                <CirclePlus />
                Add variation
              </Button>
              <Button
                border="0px"
                variant="plain"
                background="transparent"
                _hover={{ backgroundColor: "transparent", color: "blue" }}
                onClick={() => setEqualProportions(groupFields, updateGroup)}
              >
                <CircleEqual />
                Set equal proportions
              </Button>
            </Flex>
          </Field>
        )}
      />
    </>
  );
};

export default ABSubForm;
