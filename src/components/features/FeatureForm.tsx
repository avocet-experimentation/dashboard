import {
  chakra,
  createListCollection,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { Field } from "../ui/field";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { FeatureFlag } from "@estuary/types";
import FeatureService from "#/services/FeatureService";

type Inputs = Omit<FeatureFlag, "id">;

const environments = createListCollection({
  items: ["dev", "prod", "testing"],
});

const valueTypes = createListCollection({
  items: [
    { label: "Boolean (on/off)", value: "boolean" },
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
  ],
});

const defaultFeatureFlag: Inputs = {
  name: "",
  valueType: "boolean", // Defaulting to string, but adjust as needed
  defaultValue: "true", // Adjust based on default behavior for string type
  description: "",
  environments: {
    prod: {
      name: "prod",
      enabled: false,
      overrideRules: [],
    },
    dev: {
      name: "dev",
      enabled: true,
      overrideRules: [],
    },
    testing: {
      name: "testing",
      enabled: true,
      overrideRules: [],
    },
    staging: {
      name: "staging",
      enabled: false,
      overrideRules: [],
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const featureService = new FeatureService();

const FeatureCreationForm = ({ formId }) => {
  const [valueType, setValueType] = useState("boolean");
  const [isError, setIsError] = useState(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultFeatureFlag,
  });
  const onSubmit: SubmitHandler<Inputs> = async (featureContent) => {
    const response = await featureService.createFeature(featureContent);
    if (response.status === 409) {
      const { error } = await response.json();
      setIsError(error);
    } else if (response.status === 201) {
      const featureId = response.text();
    }
  };

  return (
    <chakra.form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Field
              label="Feature Name"
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="my-first-flag"
                {...register("name", {
                  required:
                    "Feature name is required and must be between 3-20 characters long.",
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
            <Field
              label="Description"
              invalid={!!errors.name}
              errorText={errors.description?.message}
            >
              <Input
                placeholder="A human-readable description of your feature flag."
                {...register("description", {
                  required: "A description of your feature is required.",
                })}
              />
            </Field>
          )}
        />
        <Field label="Enabled Environments">
          <Flex direction="row" width="100%" justifyContent="space-evenly">
            {environments.items.map((env) => (
              <Controller
                key={env}
                name={`environments.${env}.enabled`}
                control={control}
                render={({ field }) => (
                  <Flex>
                    <Text marginRight="5px">{`${env}:`}</Text>
                    <Switch
                      id={env}
                      name={field.name}
                      checked={!!field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                      inputProps={{ onBlur: field.onBlur }}
                      width="fit-content"
                    />
                  </Flex>
                )}
              />
            ))}
          </Flex>
        </Field>
        <Field label="Value Type" width="320px">
          <Controller
            control={control}
            name="valueType"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={[field.value]}
                onValueChange={({ value }) => {
                  field.onChange(value[0]);
                  setValueType(value[0]);
                }}
                onInteractOutside={() => field.onBlur()}
                collection={valueTypes}
              >
                <SelectTrigger>
                  <SelectValueText />
                </SelectTrigger>
                <SelectContent zIndex="popover">
                  {valueTypes.items.map((type) => (
                    <SelectItem item={type} key={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>
        {valueType === "boolean" && (
          <Controller
            name="defaultValue"
            control={control}
            render={({ field }) => (
              <Switch
                name={field.name}
                checked={!!field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                {!!field.value ? "on" : "off"}
              </Switch>
            )}
          />
        )}
        {valueType === "string" && (
          <Controller
            name="defaultValue"
            control={control}
            render={({ field }) => (
              <Field label="Default Value">
                <Input
                  type="text"
                  placeholder="A string value"
                  {...register("defaultValue", {
                    required: "A default value is required.",
                  })}
                />
              </Field>
            )}
          />
        )}
        {valueType === "number" && (
          <Controller
            name="defaultValue"
            defaultValue={0}
            control={control}
            render={({ field }) => (
              <Field label="Default Value">
                <Input
                  type="number"
                  placeholder="A number value"
                  {...register("defaultValue", {
                    required: "A default value is required.",
                  })}
                />
              </Field>
            )}
          />
        )}
      </Stack>
    </chakra.form>
  );
};
export default FeatureCreationForm;
