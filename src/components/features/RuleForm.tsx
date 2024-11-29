import { chakra, Flex, Input, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  useForm,
  SubmitHandler,
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  ControllerRenderProps,
} from 'react-hook-form';
import {
  flagDefaultValueMap,
  FlagValueTypeDef,
  ForcedValue,
  getOverrideRuleSchemaFromType,
  OverrideRuleUnion,
  RuleType,
  SchemaParseError,
} from '@estuary/types';
// import { useLocation } from 'wouter';
import FeatureService from '#/services/FeatureService';
import { RULE_TYPES, RuleTypeDisplayDataTuple } from '#/lib/featureConstants';
import { Switch } from '../ui/switch';
import { RadioCardItem, RadioCardLabel, RadioCardRoot } from '../ui/radio-card';
import { Field } from '../ui/field';

const featureService = new FeatureService();

const validateFormData = <R extends { type: OverrideRuleUnion['type'] }>(
  ruleContent: R,
): OverrideRuleUnion => {
  const schema = getOverrideRuleSchemaFromType(ruleContent.type);
  const safeParseResult = schema.safeParse(ruleContent);
  if (!safeParseResult.success) {
    throw new SchemaParseError(safeParseResult);
  }

  return safeParseResult.data;
};

interface RuleFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  featureFlagId: string;
  valueType: FlagValueTypeDef;
  envName: string;
}

/**
 * Allows users to select an override rule type and provide the mandatory fields
 * from which to create a template
 *
 * todo:
 * - redirect users to (or embed) ExperimentForm if they select experiments
 * - add a route for this form, and navigate back to the flag's page on
 * successful submission
 */
export default function RuleInitializationForm({
  formId,
  setIsLoading,
  featureFlagId,
  valueType,
  envName,
}: RuleFormProps) {
  const [isError, setIsError] = useState<boolean>(false);
  const [ruleType, setRuleType] =
    useState<OverrideRuleUnion['type']>('ForcedValue');

  // const [location, navigate] = useLocation();

  // const {
  //   control,
  //   setValue,
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<OverrideRuleUnion>({
  //   defaultValues: ruleDefaults.ForcedValue,
  // });

  return (
    <Flex direction="column">
      <RuleTypeSelector setRuleType={setRuleType} />
      {ruleType === 'ForcedValue' && (
        <ForcedValueInitForm
          valueType={valueType}
          envName={envName}
          formId={formId}
          featureFlagId={featureFlagId}
          setIsLoading={setIsLoading}
        />
      )}
    </Flex>
  );
}

interface RuleTypeSelectorProps {
  setRuleType: React.Dispatch<React.SetStateAction<OverrideRuleUnion['type']>>;
}

function RuleTypeSelector({ setRuleType }: RuleTypeSelectorProps) {
  return (
    <RadioCardRoot
      orientation="vertical"
      justify="center"
      onValueChange={(e) => {
        setRuleType(e.value as RuleType);
      }}
    >
      <RadioCardLabel textStyle="sm" fontWeight="medium">
        Select rule type:
      </RadioCardLabel>
      {(Object.entries(RULE_TYPES) as RuleTypeDisplayDataTuple[]).map(
        ([ruleKey, rule]) => {
          return (
            <RadioCardItem
              cursor="pointer"
              label={rule.name}
              description={rule.description}
              indicator={false}
              key={ruleKey}
              value={ruleKey}
            />
          );
        },
      )}
    </RadioCardRoot>
  );
}

interface TextFieldProps<T extends FieldValues> {
  fieldLabel: Path<T>;
  control: Control<T>;
  required: boolean;
  errors: FieldErrors<T>;
}

// function TextField<T extends FieldValues>({
//   fieldLabel,
//   control,
//   required,
//   errors,
// }: TextFieldProps<T>) {
//   return (
//     <Controller
//       name={fieldLabel}
//       control={control}
//       render={() => (
//         <Field
//           label="Description"
//           invalid={!!errors.description}
//           errorText={errors.description?.message}
//         >
//           <Input
//             placeholder="A human-readable description of your rule"
//             {...register('description', {
//               required: 'A description of your rule is required.',
//             })}
//           />
//         </Field>
//       )}
//     />
//   );
// }

// /**
//  * Given a specific value type, hold common logic for rule creation
//  */
// function RuleCreationForm() {}

interface ForcedValueInitFormProps {
  valueType: FlagValueTypeDef;
  envName: string;
  formId: string;
  featureFlagId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function ForcedValueInitForm({
  valueType,
  envName,
  formId,
  featureFlagId,
  setIsLoading,
}: ForcedValueInitFormProps) {
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForcedValue>({
    defaultValues: ForcedValue.template({
      value: flagDefaultValueMap[valueType],
      environmentName: envName,
    }),
  });

  const onSubmit: SubmitHandler<ForcedValue> = async (ruleContent) => {
    setIsLoading(true);

    const parsedRule = validateFormData(ruleContent);
    // const parsedRule: OverrideRuleUnion = parseWithConciseError(schema, ruleContent);

    const response = await featureService.addRule(
      featureFlagId,
      envName,
      parsedRule,
    );

    // todo: replace with a navigate() call
    if (response.ok) {
      window.location.reload();
    }
    setIsLoading(false);
  };

  return (
    <chakra.form id={formId} marginTop="25px" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="A human-readable description of your rule"
                {...register('description', {
                  // required: 'A description of your rule is required.',
                })}
              />
            </Field>
          )}
        />

        <OverrideValueField
          control={control}
          register={register}
          valueType={valueType}
        />
      </Stack>
    </chakra.form>
  );
}

interface OverrideValueFieldProps {
  control: Control<ForcedValue, any>;
  register: UseFormRegister<ForcedValue>;
  valueType: 'string' | 'number' | 'boolean';
}

function OverrideValueField({
  control,
  register,
  valueType,
}: OverrideValueFieldProps) {
  return (
    <Controller
      name="value"
      control={control}
      render={({ field }) => (
        <Field label="Value to Force">
          {valueType === 'string' && (
            <Input
              placeholder={`A ${valueType} value`}
              defaultValue={''}
              {...register('value', {
                required: 'A forced value is required.',
              })}
            />
          )}
          {valueType === 'boolean' && (
            <Switch
              name={field.name}
              checked={!!field.value}
              onCheckedChange={({ checked }) => field.onChange(checked)}
              inputProps={{ onBlur: field.onBlur }}
            >
              {field.value ? 'on' : 'off'}
            </Switch>
          )}
          {valueType === 'number' && (
            <Input
              type="number"
              placeholder="A number value"
              {...register('value', {
                valueAsNumber: true,
                required: 'A default value is required.',
              })}
            />
          )}
        </Field>
      )}
    />
  );
}

// interface ForcedValueOverrideBooleanProps {
//   field: ControllerRenderProps<ForcedValue, 'value'>;
// }
// function ForcedValueOverrideBoolean({
//   field,
// }: ForcedValueOverrideBooleanProps) {
//   return (
//     <Switch
//       name={field.name}
//       checked={!!field.value}
//       onCheckedChange={({ checked }) => field.onChange(checked)}
//       inputProps={{ onBlur: field.onBlur }}
//     >
//       {field.value ? 'on' : 'off'}
//     </Switch>
//   );
// }
