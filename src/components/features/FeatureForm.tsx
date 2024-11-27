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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FeatureFlagDraft,
  featureFlagDraftSchema,
  flagDefaultValueMap,
  flagValueTypeDefSchema,
  SchemaParseError,
} from "@estuary/types";
import FeatureService from "#/services/FeatureService";
import { useLocation } from "wouter";

// todo: replace this placeholder with fetched environment names
const environments = createListCollection<string>({
  items: ["dev", "prod", "testing", "staging"],
});
const valueTypes = createListCollection({
  items: [
    { label: "Boolean (on/off)", value: "boolean" },
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
  ],
});

const defaultFeatureFlag: FeatureFlagDraft = FeatureFlagDraft.templateBoolean({
  name: ''
});

const featureService = new FeatureService();

interface FeatureFlagCreationFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeatureCreationForm(
  { formId, setIsLoading }: FeatureFlagCreationFormProps
) {
  const [isError, setIsError] = useState(null);
  const [location, navigate] = useLocation();

  const {
    control,
    setValue,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FeatureFlagDraft>({
    defaultValues: defaultFeatureFlag,
    // resolver: zodResolver(featureFlagDraftSchema),
  });

  const onSubmit: SubmitHandler<FeatureFlagDraft> = async (featureContent) => {
    console.log('submit handler invoked');
    
    // placeholder
    Object.keys(featureContent.environmentNames).forEach((key) => {
      if (featureContent.environmentNames[key] !== true) {
        delete featureContent.environmentNames[key];
      }
  })
    // these lines unnecessary if the resolver argument to `useForm` works
    const safeParseResult = featureFlagDraftSchema.safeParse(featureContent);
    console.log({featureContent})
    if (!safeParseResult.success) {
      // the error pretty-print the Zod parse error message
      throw new SchemaParseError(safeParseResult); 
    }
    setIsLoading(true);
    const response = await featureService.createFeature(safeParseResult.data);
    if (response.status === 409) {
      const { error } = await response.json();
      setIsError(error);
    } else if (response.status === 201) {
      const { fflagId } = await response.json();
      navigate(`/features/${fflagId}`);
    } else if (response.status) {
    }
    setIsLoading(false);
  };

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
        <Field label="Enabled Environments" as="p"></Field>
        <Flex direction="row" width="100%" justifyContent="space-evenly">
          {environments.items.map((env: string) => {
            return (
              <Controller
                key={env}
                name={`environmentNames.${env}`}
                control={control}
                render={({ field }) => (
                  <Flex>
                    <Text marginRight="5px">{`${env}:`}</Text>
                    <Switch
                      id={env}
                      name={field.name}
                      checked={!!field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                      onBlur={field.onBlur}
                      width="fit-content"
                    />
                  </Flex>
                )}
              />
            );
          })}
        </Flex>

        <Field label="Value Type" width="320px">
          <Controller
            control={control}
            name="value.type"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={[field.value]}
                collection={valueTypes}
                onValueChange={({ value }) => {
                  const selectedValueType = flagValueTypeDefSchema.parse(value[0]);
                  field.onChange(value[0]);
                  const newDefault = flagDefaultValueMap[selectedValueType];
                  console.log({selectedValueType, newDefault})
                  setValue('value.initial', newDefault);
                }}
                onInteractOutside={() => field.onBlur()}
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
            const valueType = getValues('value.type');
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
            return <></>;
          }}
        />
      </Stack>
    </chakra.form>
  );
};
