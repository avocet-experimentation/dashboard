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
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FeatureFlagDraft, FlagCurrentValue } from "@estuary/types";
import FeatureService from "#/services/FeatureService";
import { useLocation } from "wouter";

const environments = createListCollection({
  items: ["dev", "prod", "testing", "staging"],
});

const valueTypes = createListCollection({
  items: [
    { label: "Boolean (on/off)", value: "boolean" },
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
  ],
});

const defaultFeatureFlag: FeatureFlagDraft = {
  name: "",
  value: {
    type: "boolean",
    initial: true,
  },
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
};

const featureService = new FeatureService();

const getDefaultValue = (valueType: string) => {
  if (valueType === "string") return String("true");
  if (valueType === "number") return Number(1);
  return Boolean(true); // matches default valueType
};

const FeatureCreationForm = ({ formId, setIsLoading }) => {
  const [valueType, setValueType] = useState<FlagCurrentValue>(
    defaultFeatureFlag.value.type
  );
  const [isError, setIsError] = useState(null);
  const [location, navigate] = useLocation();
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeatureFlagDraft>({
    defaultValues: defaultFeatureFlag,
  });
  const onSubmit: SubmitHandler<FeatureFlagDraft> = async (featureContent) => {
    setIsLoading(true);
    const response = await featureService.createFeature(featureContent);
    if (response.status === 409) {
      const { error } = await response.json();
      setIsError(error);
    } else if (response.status === 201) {
      const { fflagId } = await response.json();
      navigate(`/features/${fflagId}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Update value.default whenever valueType changes
    setValue("value.initial", getDefaultValue(valueType));
  }, [valueType, setValue]);

  return (
    <chakra.form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4">
        <Controller
          name="name"
          control={control}
          render={() => (
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
                  pattern: {
                    value: /^[0-9A-Za-z-]+$/gi,
                    message:
                      "Feature names may only contain letters, numbers, and hyphens.",
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
          render={() => (
            <Field
              label="Description"
              invalid={!!errors.description}
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
                      key={`${env}-switch`}
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
            name="value.type"
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
        <Controller
          name="value.initial"
          control={control}
          render={({ field }) => {
            if (valueType === "boolean")
              return (
                <Switch
                  name={field.name}
                  checked={!!field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                  inputProps={{ onBlur: field.onBlur }}
                >
                  {!!field.value ? "on" : "off"}
                </Switch>
              );

            if (valueType === "string")
              return (
                <Field label="Default Value">
                  <Input
                    type="text"
                    placeholder="A string value"
                    {...register("value.initial", {
                      required: "A default value is required.",
                    })}
                  />
                </Field>
              );

            if (valueType === "number")
              return (
                <Field label="Default Value">
                  <Input
                    type="number"
                    placeholder="A number value"
                    {...register("value.initial", {
                      valueAsNumber: true,
                      required: "A default value is required.",
                    })}
                  />
                </Field>
              );
          }}
        />
      </Stack>
    </chakra.form>
  );
};
export default FeatureCreationForm;
