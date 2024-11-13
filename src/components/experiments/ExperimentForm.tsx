import { useEffect, useState } from "react";
import {
  Button,
  chakra,
  createListCollection,
  Flex,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { X } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Experiment } from "@fflags/types";

type Inputs = Omit<Experiment, "id">;

const ExperimentCreationForm = ({ formId, setIsLoading }) => {
  const [allFeatures, setAllFeatures] = useState(
    createListCollection({
      items: [{ name: "test-flag", id: "abc123" }],
    })
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      groups: [{ id: "blah", name: "control", proportion: 0.5 }],
    },
  });
  const onSubmit = (data) => {
    console.log("data", data);
  };

  useEffect(() => {});

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius="5px"
      width="40%"
      height="55vh"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      padding="25px"
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bg="whitesmoke"
      >
        Create New Experiment
        <X cursor="pointer" onClick={() => setShowForm(false)} />
      </Flex>
      <chakra.form id="flag-management-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Field label="Feature Name">
                <Input
                  placeholder="my-first-experiment"
                  {...register("name", {
                    required: "Experiment name is required.",
                  })}
                />
              </Field>
            )}
          />
          <Controller
            name="hypothesis"
            control={control}
            render={({ field }) => (
              <Field label="Description">
                <Input
                  placeholder="What is your testing goal with this experiment?"
                  {...register("hypothesis", {
                    required: "A hypothesis of your experiment is required.",
                  })}
                />
              </Field>
            )}
          />
          <Field label="Value Type" width="320px">
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
          </Field>
          <Button color="black" size="sm" type="submit" mt="4">
            Create
          </Button>
        </Stack>
      </chakra.form>
    </Flex>
  );
};
export default ExperimentCreationForm;
