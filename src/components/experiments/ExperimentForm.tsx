import { useEffect, useState } from "react";
import {
  Box,
  Button,
  chakra,
  Flex,
  Input,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { RadioGroup } from "../ui/radio";
import { Table } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { CirclePlus, CircleEqual } from "lucide-react";

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { Experiment, ExperimentGroup } from "@estuary/types";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Radio } from "../ui/radio";

// type Inputs = Omit<Experiment, "id" | "groups"> & {
//   groups: Omit<ExperimentGroup, "id">[];
// };

type Inputs = Experiment;

const defaultExperiment: Inputs = {
  name: "",
  hypothesis: "",
  description: "",
  type: "Experiment",
  status: "draft",
  enrollment: {
    attributes: ["id"],
    proportion: [100], // this will be converted `onSubmit` to a value between 0 and 1
  },
  groups: [
    {
      id: "",
      name: "Control",
      proportion: 0.5,
      cycles: 1,
      sequenceId: undefined,
    },
    {
      id: "",
      name: "Variation",
      proportion: 0.5,
      cycles: 1,
      sequenceId: undefined,
    },
  ],
  dependents: [],
  definedTreatments: [],
  definedSequences: [],
};

const appendedGroup = (index: number): ExperimentGroup => {
  return {
    id: "",
    name: `Variation ${index}`,
    proportion: 0,
    cycles: 1,
    sequenceId: undefined,
  };
};

const setEqualProportions = (
  fields: ExperimentGroup[],
  fieldArrayUpdate
): void => {
  const numOfVariations: number = fields.length;
  const split: number = Math.trunc((1 / numOfVariations) * 10000) / 10000;
  let remainder = 1 - split * numOfVariations;
  console.log(split, remainder);
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

const createGroupIds = (expContent: Inputs) => {
  const expName = expContent.name;
  const expGroups = expContent.groups;
  expGroups.forEach((group) => {
    const groupName = group.name;
    group.id = `${expName}-${groupName}`;
  });
};

const reformatAllTrafficProportion = (expContent: Inputs): void => {
  const originalProportion = expContent.enrollment.proportion;
  const reformatted = parseFloat((originalProportion / 100).toFixed(2));
  expContent.enrollment.proportion = reformatted;
};

const ExperimentCreationForm = ({ formId, setIsLoading }) => {
  const [expType, setExpType] = useState<string>("ab");
  const [render, setRender] = useState();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultExperiment,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "groups",
  });

  const onSubmit = (expContent: Inputs) => {
    createGroupIds(expContent);
    reformatAllTrafficProportion(expContent);
    console.log("data", expContent);
  };

  useEffect(() => {});

  return (
    <chakra.form
      id="experiment-management-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack gap="4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Field
              label="Experiment Name"
              helperText={
                !errors.name
                  ? "Acts as a unique identifier used to track impressions and analyze results."
                  : null
              }
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="my-first-experiment"
                {...register("name", {
                  required:
                    "Experiment name is required and must be between 3-20 characters long.",
                  pattern: {
                    value: /^[0-9A-Za-z-]+$/gi,
                    message:
                      "Experiment names may only contain letters, numbers, and hyphens.",
                  },
                  minLength: 3,
                  maxLength: 20,
                })}
              />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Field label="Description">
              <Input
                placeholder="A human-readable description of your experiment."
                {...register("description", {
                  required: "A description of your experiment is required.",
                })}
              />
            </Field>
          )}
        />
        <Controller
          name="hypothesis"
          control={control}
          render={() => (
            <Field label="Hypothesis">
              <Input
                placeholder="What do you expect to happen in this experiment ?"
                {...register("hypothesis", {
                  required: "A hypothesis of your experiment is required.",
                })}
              />
            </Field>
          )}
        />
        {/* <Field
          label="Assign value based on attribute"
          helperText="Will be hashed together with the Tracking Key to determine which variation to assign."
        >
          <Controller
            control={control}
            name="featureFlag"
            render={({ field }) => {
              return (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    field.onChange(value[0]);
                  }}
                  onInteractOutside={() => field.onBlur()}
                  collection={allFeatures}
                >
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent>
                    {allFeatures.items.map((feature) => (
                      <SelectItem item={feature.name} key={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              );
            }}
          />
        </Field> */}
        <Controller
          name="enrollment.proportion"
          control={control}
          render={({ field }) => (
            <Field
              label={`Traffic included in this experiment: ${field.value[0]}`}
            >
              <Slider
                width="full"
                onFocusChange={({ focusedIndex }) => {
                  if (focusedIndex !== -1) return;
                  field.onBlur();
                }}
                name={field.name}
                value={[field.value]}
                onValueChange={({ value }) => {
                  field.onChange(value);
                }}
              />
            </Field>
          )}
        />
        <Box>
          <Field label={"Experiment Type"} />
          <RadioGroup
            defaultValue={expType}
            onValueChange={(e) => setExpType(e.value)}
          >
            <HStack gap="6">
              <Radio value="ab">A/B</Radio>
              <Radio value="switchback">Switchback</Radio>
            </HStack>
          </RadioGroup>
        </Box>

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
                <Table.Root stickyHeader>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>VARIATION</Table.ColumnHeader>
                      <Table.ColumnHeader>NAME</Table.ColumnHeader>
                      <Table.ColumnHeader>SPLIT</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {expType === "ab" &&
                      fields.map((field, index) => (
                        <Table.Row key={field.id}>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>
                            <Input
                              border="0px"
                              width="125px"
                              defaultValue={field.name || `Variation ${index}`}
                              {...register(`groups.${index}.name`, {
                                required:
                                  "Feature name is required and must be between 3-20 characters long.",
                                pattern: {
                                  value: /^[0-9A-Za-z-]+$/gi,
                                  message:
                                    "Feature names may only contain letters, numbers, and hyphens.",
                                },
                                minLength: 3,
                                maxLength: 20,
                              })}
                            />
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
                        </Table.Row>
                      ))}
                    {expType === "switchback" && (
                      <Table.Row>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>
                          <Input
                            border="0px"
                            width="125px"
                            defaultValue={fields[0].name}
                            {...register(`groups.0.name`, {
                              required:
                                "Feature name is required and must be between 3-20 characters long.",
                              pattern: {
                                value: /^[0-9A-Za-z-]+$/gi,
                                message:
                                  "Feature names may only contain letters, numbers, and hyphens.",
                              },
                              minLength: 3,
                              maxLength: 20,
                            })}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Field
                            invalid={!!errors.groups?.[0]?.proportion}
                            errorText={errors.groups?.[0]?.proportion?.message}
                          >
                            <Input
                              border="0px"
                              width="75px"
                              defaultValue={1}
                              {...register(`groups.0.proportion`, {
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
                      </Table.Row>
                    )}
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
                  onClick={() => append(appendedGroup(fields.length))}
                >
                  <CirclePlus />
                  Add variation
                </Button>
                <Button
                  border="0px"
                  variant="plain"
                  background="transparent"
                  _hover={{ backgroundColor: "transparent", color: "blue" }}
                  onClick={() => setEqualProportions(fields, update)}
                >
                  <CircleEqual />
                  Set equal proportions
                </Button>
              </Flex>
            </Field>
          )}
        />
      </Stack>
    </chakra.form>
  );
};
export default ExperimentCreationForm;
