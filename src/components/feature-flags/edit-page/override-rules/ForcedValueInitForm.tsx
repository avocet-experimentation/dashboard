import { chakra, Input, Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  flagDefaultValueMap,
  FlagValueTypeDef,
  ForcedValue,
  getOverrideRuleSchemaFromType,
  OverrideRuleUnion,
  SchemaParseError,
} from '@avocet/core';
import { Field } from '#/components/ui/field';
import OverrideValueField from './OverrideValueField';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  FEATURE_FLAG,
  gqlRequest,
  UPDATE_FEATURE_FLAG,
} from '#/lib/graphql-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import NotFound from '#/components/NotFound';

const validateFormData = <R extends Pick<OverrideRuleUnion, 'type'>>(
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
  flagId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Create Forced Value rules
 * TODO:
 * - disable the form while submission is pending
 */
export default function ForcedValueInitForm({
  valueType,
  envName,
  formId,
  flagId,
  setOpen,
}: ForcedValueInitFormProps) {
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

  const flagQuery = useQuery({
    queryKey: ['featureFlag', flagId],
    queryFn: async () => gqlRequest(FEATURE_FLAG, { id: flagId }),
  });

  const addRule = useMutation({
    mutationKey: ['featureFlag', flagId],
    mutationFn: async (updatedRules: OverrideRuleUnion[]) =>
      gqlRequest(UPDATE_FEATURE_FLAG, {
        partialEntry: { id: flagId, overrideRules: updatedRules },
      }),
    onSuccess: () => setOpen(false),
  });

  if (flagQuery.isPending) return <Loader />;
  if (flagQuery.isError) return <ErrorBox error={flagQuery.error} />;
  if (flagQuery.data.featureFlag === null)
    return <NotFound componentName="ForcedValueInitForm" />;

  const { featureFlag } = flagQuery.data;

  const onSubmit: SubmitHandler<ForcedValue> = async (ruleContent) => {
    const parsedRule = validateFormData(ruleContent);
    addRule.mutate([...featureFlag.overrideRules, parsedRule]);
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
                {...register('description')}
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
