import { Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  Environment,
  EnvironmentDraft,
  environmentDraftSchema,
  SchemaParseError,
} from '@avocet/core';
import { NameField } from '../../forms/DefinedFields';
import ControlledSwitch from '../../forms/ControlledSwitch';
import { useGQLMutation } from '#/lib/graphql-queries';
import {
  CREATE_ENVIRONMENT,
  UPDATE_ENVIRONMENT,
} from '#/lib/environment-queries';

interface EnvironmentManagementFormProps {
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  environment?: Environment;
}

/**
 * Create an environment or update an existing one, if passed as an argument
 */
export default function EnvironmentManagementForm({
  formId,
  setOpen,
  environment,
}: EnvironmentManagementFormProps) {
  const handleSubmitSuccess = () => {
    setOpen(false);
  };

  const handleSubmitError = <E extends Error>(error: E) => {
    console.error(error); // TODO: handle the error better
  };

  const createEnv = useGQLMutation({
    mutation: CREATE_ENVIRONMENT,
    cacheKey: ['allEnvironments'],
    onSuccess: handleSubmitSuccess,
    onError: handleSubmitError,
  });

  const updateEnv = useGQLMutation({
    mutation: UPDATE_ENVIRONMENT,
    cacheKey: ['allEnvironments'],
    onSuccess: handleSubmitSuccess,
    onError: handleSubmitError,
  });

  const defaultValues: EnvironmentDraft =
    environment ?? EnvironmentDraft.template({ name: '' });

  const formMethods = useForm<Environment>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<EnvironmentDraft> = async (
    environmentContent,
  ) => {
    const safeParseResult =
      environmentDraftSchema.safeParse(environmentContent);
    if (!safeParseResult.success) {
      // the error pretty-prints the Zod parse error message
      throw new SchemaParseError(safeParseResult);
    }

    if (environment) {
      updateEnv.mutate({
        partialEntry: { ...safeParseResult.data, id: environment.id },
      });
    } else {
      createEnv.mutate({ newEntry: safeParseResult.data });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField disabled={!!environment} label="Environment Name" />
          <ControlledSwitch
            fieldPath="defaultEnabled"
            label="Enabled by default for new feature flags"
            labelPosition="right"
            switchId="set-default-enabled"
          />
          <ControlledSwitch
            fieldPath="pinToLists"
            label="Display a quick toggler on the feature flags list"
            labelPosition="right"
            switchId="set-pin-to-lists"
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
