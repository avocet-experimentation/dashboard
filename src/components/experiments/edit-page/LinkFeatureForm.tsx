import { Controller, useForm } from "react-hook-form";
import { Field } from "../../ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../ui/select";
import { chakra } from "@chakra-ui/react";

const LinkFeatureForm = ({ formId, setIsLoading }) => {
  return (
    <chakra.form id={formId}>
      <Field
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
      </Field>
    </chakra.form>
  );
};

export default LinkFeatureForm;
