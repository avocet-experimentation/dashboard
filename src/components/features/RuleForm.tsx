import { chakra, Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { RadioCardItem, RadioCardLabel, RadioCardRoot } from "../ui/radio-card";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ForcedValue } from "@estuary/types";
import { Switch } from "../ui/switch";

const RULE_TYPES = {
  ForcedValue: {
    name: "Forced Value",
    description: "Target groups of users and give them all the same value.",
  },
  Experiment: {
    name: "Experiment",
    description: "Measure the impact of this feature on your key metrics.",
  },
};

type Inputs = Omit<ForcedValue, "id">;

const defaultForcedValueRule: Inputs = {
  type: "ForcedValue",
  value: true,
  description: "",
  status: "active",
  enrollment: {
    attributes: [],
    proportion: 1,
  },
};

const RuleForm = ({ formId, setIsLoading, valueType, defaultValue }) => {
  const [isError, setIsError] = useState(null);
  const [ruleType, setRuleType] = useState<string | null>(null);
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: defaultForcedValueRule,
  });

  const onSubmit: SubmitHandler<Inputs> = async (featureContent) => {
    setIsLoading(true);
    setIsLoading(false);
  };

  useEffect(() => {
    // Update value.default whenever valueType changes
    setValue("value", defaultValue);
  }, [defaultValue, setValue]);

  return (
    <Flex direction="column">
      <RadioCardRoot
        orientation="vertical"
        justify="center"
        onValueChange={(e) => setRuleType(e.value)}
      >
        <RadioCardLabel textStyle="sm" fontWeight="medium">
          Select rule type:
        </RadioCardLabel>
        {Object.keys(RULE_TYPES).map((ruleKey) => {
          const rule = RULE_TYPES[ruleKey];
          return (
            <RadioCardItem
              label={rule.name}
              description={rule.description}
              indicator={false}
              key={ruleKey}
              value={ruleKey}
            ></RadioCardItem>
          );
        })}
      </RadioCardRoot>
      {!!ruleType && (
        <chakra.form
          id={formId}
          marginTop="25px"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack gap={4}>
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
                    placeholder="A human-readable description of your rule."
                    {...register("description", {
                      required: "A description of your rule is required.",
                    })}
                  />
                </Field>
              )}
            />
            {ruleType === "ForcedValue" && (
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <Field
                    label="Value to Force"
                    invalid={!!errors.description}
                    errorText={errors.description?.message}
                  >
                    {valueType === "string" && (
                      <Input
                        placeholder={`A ${valueType} value`}
                        defaultValue={defaultValue}
                        {...register("value", {
                          required:
                            "A description of your feature is required.",
                        })}
                      />
                    )}
                    {valueType === "boolean" && (
                      <Switch
                        name={field.name}
                        checked={!!field.value}
                        onCheckedChange={({ checked }) =>
                          field.onChange(checked)
                        }
                        inputProps={{ onBlur: field.onBlur }}
                      >
                        {!!field.value ? "on" : "off"}
                      </Switch>
                    )}
                    {valueType === "number" && (
                      <Input
                        type="number"
                        placeholder="A number value"
                        {...register("value", {
                          required: "A default value is required.",
                        })}
                      />
                    )}
                  </Field>
                )}
              />
            )}
          </Stack>
        </chakra.form>
      )}
    </Flex>
  );
};

export default RuleForm;
