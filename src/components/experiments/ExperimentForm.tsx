import { useEffect, useState } from "react";
import {
  Box,
  Button,
  chakra,
  Fieldset,
  Flex,
  Input,
  Stack,
  HStack,
  SelectLabel,
  createListCollection,
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
import FeatureService from "#/services/FeatureService";

import { Experiment, ExperimentGroup } from "@estuary/types";
import { Slider } from "../ui/slider";
import { Radio } from "../ui/radio";
import { ABExperimentTemplate, SwitchbackTemplate } from "@estuary/types";
import ExperimentService from "#/services/ExperimentService";
import ABSubForm from "./ABSubForm";
import SwitchbackSubForm from "./SwitchbackSubForm";

// type Inputs = Omit<Experiment, "id" | "groups"> & {
//   groups: Omit<ExperimentGroup, "id">[];
// };

const templateToObject = (template) => {
  return Object.getOwnPropertyNames(template).reduce((acc, prop) => {
    acc[prop] = template[prop];
    return acc;
  }, {});
};

const abTemplate = new ABExperimentTemplate("my-first-exp", "dev");

const defaultAB = templateToObject(abTemplate);

const switchbackTemplate = new SwitchbackTemplate("my-first-switchback", "dev");

const defaultSwitchback = templateToObject(switchbackTemplate);

const expService = new ExperimentService();
const featureService = new FeatureService();

const createTreatmentCollection = (definedTreatments) => {
  const items = Object.entries(definedTreatments).map(([id, treatment]) => {
    return { label: treatment.name, value: id };
  });
  return createListCollection({ items });
};

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

// const createGroupIds = (expContent: Inputs) => {
//   const expName = expContent.name;
//   const expGroups = expContent.groups;
//   expGroups.forEach((group) => {
//     const groupName = group.name;
//     group.id = `${expName}-${groupName}`;
//   });
// };

const reformatAllTrafficProportion = (expContent: Inputs): void => {
  const originalProportion = expContent.enrollment.proportion;
  const reformatted = parseFloat((originalProportion / 100).toFixed(2));
  expContent.enrollment.proportion = reformatted;
};

const ExperimentCreationForm = ({ formId, setIsLoading }) => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [expType, setExpType] = useState<"ab" | "switchback">("ab");
  const [formValues, setFormValues] = useState({
    ab: defaultAB,
    switchback: defaultSwitchback,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Experiment>({
    defaultValues: formValues[expType],
  });

  // Save current form state before switching
  const handleSwitchForm = (newExpType: "ab" | "switchback") => {
    const currentValues = getValues();
    setFormValues((prevState) => ({
      ...prevState,
      [expType]: currentValues, // Save current form values
    }));
    setExpType(newExpType); // Update form type
  };

  // Handle form switching
  useEffect(() => {
    reset(formValues[expType]); // Use updated formValues for reset
  }, [expType, reset, getValues]);

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const allFeatures = await featureService.getAllFeatures();
        setFeatures(allFeatures ? await allFeatures.json() : []);
      } catch (error) {
        console.log(error);
      }
    };

    return () => handleGetAllFeatures();
  }, []);

  const {
    fields: groupFields,
    append: addGroup,
    remove: removeGroup,
    update: updateGroup,
  } = useFieldArray({
    control,
    name: "groups",
  });

  const definedTreatments = watch("definedTreatments");

  const groupValues = watch("groups");

  const onSubmit = (expContent: Experiment) => {
    // createGroupIds(expContent);
    reformatAllTrafficProportion(expContent);
    console.log("data", expContent);
    expService.createExperiment(expContent);
  };

  return (
    <chakra.form id={formId} onSubmit={handleSubmit(onSubmit)}>
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
                cursor="grab"
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
        <Fieldset.Root>
          <Fieldset.Legend>Experiment Type</Fieldset.Legend>
          <RadioGroup
            defaultValue={expType}
            onValueChange={({ value }) =>
              handleSwitchForm(value as "ab" | "switchback")
            }
          >
            <HStack gap="6">
              <Radio value="ab" cursor="pointer">
                A/B
              </Radio>
              <Radio value="switchback" cursor="pointer">
                Switchback
              </Radio>
            </HStack>
          </RadioGroup>
        </Fieldset.Root>
        {expType === "ab" ? (
          <ABSubForm
            control={control}
            createTreatmentCollection={createTreatmentCollection}
            definedTreatments={definedTreatments}
            errors={errors}
            groupValues={groupValues}
            register={register}
          />
        ) : (
          <SwitchbackSubForm
            control={control}
            createTreatmentCollection={createTreatmentCollection}
            definedTreatments={definedTreatments}
            errors={errors}
            groupValues={groupValues}
            register={register}
          />
        )}
      </Stack>
    </chakra.form>
  );
};
export default ExperimentCreationForm;
