import { useState } from "react";
import {
  Button,
  chakra,
  createListCollection,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "./ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { FeatureFlag } from "@fflags/types";
import { X } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Switch } from "./ui/switch";

type Inputs = Omit<FeatureFlag, "id" | "createdAt" | "updatedAt">;

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

// const handleValueType = (value: string | string[]): string => {
//   if (typeof value === "string") {
//     return value;
//   } else if (typeof value === "object") {
//     return value[0];
//   }
//   return "";
// };

const FeatureCreationForm = ({ setShowForm }) => {
  const [valueType, setValueType] = useState("boolean");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
      environments: {
        dev: {
          enabled: false,
        },
        prod: {
          enabled: false,
        },
        testing: {
          enabled: false,
        },
      },
      valueType: "boolean",
      defaultValue: false,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data", data);
    try {
      const res = await fetch("http://localhost:3524/admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        Create New Feature
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
                  placeholder="my-first-flag"
                  {...register("name", {
                    required: "Feature name is required.",
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
                    <Flex position="relative">
                      <Text marginRight="5px">{`${env}:`}</Text>
                      <Switch
                        value={field.value}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={({ checked }) =>
                          field.onChange(checked)
                        }
                        inputProps={{ onBlur: field.onBlur }}
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
              render={({ field }) => {
                console.log(field.value[0]);
                return (
                  <SelectRoot
                    name={field.name}
                    value={field.value}
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
                    <SelectContent>
                      {valueTypes.items.map((type) => (
                        <SelectItem item={type} key={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                );
              }}
            />
          </Field>
          {valueType === "boolean" && (
            <Controller
              name="defaultValue"
              control={control}
              render={({ field }) => (
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                  inputProps={{ onBlur: field.onBlur }}
                >
                  {field.value ? "on" : "off"}
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
          <Button color="black" size="sm" type="submit" mt="4">
            Create
          </Button>
        </Stack>
      </chakra.form>
    </Flex>
  );
};
export default FeatureCreationForm;
