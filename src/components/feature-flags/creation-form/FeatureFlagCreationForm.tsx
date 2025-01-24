import { createListCollection, Flex, Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  FeatureFlagDraft,
  featureFlagDraftSchema,
  SchemaParseError,
} from '@avocet/core';
import { useLocation } from 'wouter';
import { Field } from '#/components/ui/field';
import FeatureFlagValueTypeField from './FeatureFlagValueTypeField';
import FeatureFlagDefaultValueField from './FeatureFlagDefaultValueField';
import { DescriptionField, NameField } from '#/components/forms/DefinedFields';
import ControlledSwitch from '#/components/forms/ControlledSwitch';
import { VALUE_TYPES_DISPLAY_LIST } from '../feature-constants';
import { CREATE_FEATURE_FLAG, gqlRequest } from '#/lib/graphql-queries';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface FeatureFlagCreationFormProps {
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeatureFlagCreationForm({
  formId,
  setOpen,
}: FeatureFlagCreationFormProps) {
  const [, navigate] = useLocation();
  const {
    isPending,
    isError,
    error,
    data: environments,
  } = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
  });

  const { mutate } = useMutation({
    mutationFn: async (newEntry: FeatureFlagDraft) =>
      gqlRequest(CREATE_FEATURE_FLAG, { newEntry }),
    onSuccess: (data) => {
      setOpen(false);
      navigate(`/feature-flags/${data.id}`);
    },
  });

  const formMethods = useForm<FeatureFlagDraft>({
    defaultValues: FeatureFlagDraft.templateBoolean({
      name: '',
    }),
  });

  if (isPending) return <Loader />;

  if (isError) return <ErrorBox error={error} />;

  const pinnedEnvironments = useMemo(
    () =>
      createListCollection<string>({
        items: environments
          .filter((env) => env.pinToLists)
          .map((env) => env.name),
      }),
    [environments],
  );

  const onSubmit: SubmitHandler<FeatureFlagDraft> = async (flagContent) => {
    const safeParseResult = featureFlagDraftSchema.safeParse(flagContent);
    if (!safeParseResult.success) {
      console.error(new SchemaParseError(safeParseResult));
    } else {
      mutate(safeParseResult.data);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField label="Feature Flag Name" />
          <DescriptionField />
          <Field label="Enabled Environments" as="p" />
          {/* TODO: allow environment switches to wrap to new rows,
           and add a dropdown/search box to select non-pinned environments */}
          <Flex direction="row" width="100%" justifyContent="space-evenly">
            {pinnedEnvironments.items.map((env: string) => (
              <ControlledSwitch
                key={env}
                fieldPath={`environmentNames.${env}`}
                switchId={env}
                labelPosition="left"
                label={env}
              />
            ))}
          </Flex>
          <FeatureFlagValueTypeField
            control={formMethods.control}
            setValue={formMethods.setValue}
            valueTypes={VALUE_TYPES_DISPLAY_LIST}
          />
          <FeatureFlagDefaultValueField
            control={formMethods.control}
            getValues={formMethods.getValues}
            register={formMethods.register}
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
