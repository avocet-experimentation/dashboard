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
import {
  CREATE_FEATURE_FLAG,
  useGQLMutation,
  useGQLQuery,
} from '#/lib/graphql-queries';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';

interface FeatureFlagCreationFormProps {
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeatureFlagCreationForm({
  formId,
  setOpen,
}: FeatureFlagCreationFormProps) {
  const [, navigate] = useLocation();
  const { isPending, isError, error, data } = useGQLQuery(
    ['allEnvironments'],
    ALL_ENVIRONMENTS,
  );

  const { mutate } = useGQLMutation({
    mutation: CREATE_FEATURE_FLAG,
    onSuccess: (data) => {
      const flagId = data.createFeatureFlag?.id;
      if (flagId) {
        setOpen(false);
        navigate(`/features/${flagId}`);
      }
    },
  });

  if (isPending) return <Loader />;

  if (isError) return <ErrorBox error={error} />;

  const environments = data.allEnvironments;

  const pinnedEnvironments = createListCollection<string>({
    items: environments.filter((env) => env.pinToLists).map((env) => env.name),
  });

  console.log({ environments, pinnedEnvironments });
  const formMethods = useForm<FeatureFlagDraft>({
    defaultValues: FeatureFlagDraft.templateBoolean({
      name: '',
    }),
  });

  const onSubmit: SubmitHandler<FeatureFlagDraft> = async (featureContent) => {
    try {
      // todo: remove this filtering once no longer needed
      const filteredEnvironmentNames = Object.fromEntries(
        Object.entries(featureContent.environmentNames).filter(
          ([, value]) => value === true,
        ),
      );

      const safeParseResult = featureFlagDraftSchema.safeParse({
        ...featureContent,
        environmentNames: filteredEnvironmentNames,
      });
      if (!safeParseResult.success) {
        // the error pretty-print the Zod parse error message
        throw new SchemaParseError(safeParseResult);
      }
      mutate({ newEntry: safeParseResult.data });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField label="Feature Flag Name" />
          <DescriptionField />
          <Field label="Enabled Environments" as="p" />
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
