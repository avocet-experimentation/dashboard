import { useState } from "react";
import {
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

const FeatureCreationForm = ({ setShowForm }) => {
  const [valueType, setValueType] = useState("boolean");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius="5px"
      width="60%"
      height="80vh"
      position="relative"
      top="50%"
      left="50%"
      transform="translate(-50%, -80%)"
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
      <chakra.form id="flag-management-form">
        <Stack gap="4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Field label="Feature Name">
                <Input placeholder="my-first-flag" />
              </Field>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Field label="Description">
                <Input placeholder="A human-readable description of your feature flag." />
              </Field>
            )}
          />
          <Field label="Enabled Environments">
            <Flex direction="row" width="100%" justifyContent="space-evenly">
              {environments.items.map((env) => (
                <Controller
                  name={`environments.${env}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Flex>
                      <Text marginRight="5px">{`${env}:`}</Text>
                      <Switch
                        width="fit-content"
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
              render={({ field }) => (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  defaultValue={["boolean"]}
                  onValueChange={({ value }) => {
                    field.onChange(value);
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
                  <Input type="text" placeholder="A string value" />
                </Field>
              )}
            />
          )}
          {valueType === "number" && (
            <Controller
              name="defaultValue"
              control={control}
              render={({ field }) => (
                <Field label="Default Value">
                  <Input type="number" placeholder="A number value" />
                </Field>
              )}
            />
          )}
        </Stack>
      </chakra.form>
    </Flex>
  );
};
export default FeatureCreationForm;
