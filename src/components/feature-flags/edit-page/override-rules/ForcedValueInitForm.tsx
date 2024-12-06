import { chakra, Input, Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  flagDefaultValueMap,
  FlagValueTypeDef,
  ForcedValue,
  getOverrideRuleSchemaFromType,
  OverrideRuleUnion,
  SchemaParseError,
} from '@estuary/types';
import { useContext } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import { Field } from '#/components/ui/field';
import OverrideValueField from './OverrideValueField';

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

interface ForcedValueInitFormProps {
  valueType: FlagValueTypeDef;
  envName: string;
  formId: string;
  featureFlagId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ForcedValueInitForm({
  valueType,
  envName,
  formId,
  featureFlagId,
  setIsLoading,
  setOpen,
}: ForcedValueInitFormProps) {
  const services = useContext(ServicesContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForcedValue>({
    defaultValues: ForcedValue.template({
      value: flagDefaultValueMap[valueType],
      environmentName: envName,
      status: 'active',
    }),
  });

  const onSubmit: SubmitHandler<ForcedValue> = async (ruleContent) => {
    setIsLoading(true);

    const parsedRule = validateFormData(ruleContent);
    // const parsedRule: OverrideRuleUnion = parseWithConciseError(schema, ruleContent);

    const response = await services.featureFlag.addRule(
      featureFlagId,
      envName,
      parsedRule,
    );

    // todo: replace with a navigate() call
    if (response.ok) {
      window.location.reload();
    }
    setIsLoading(false);
    setOpen(false);
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
