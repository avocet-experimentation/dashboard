import { Stack, Text } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  sdkConnectionDraftSchema,
  SchemaParseError,
  SDKConnection,
  SDKConnectionDraft,
  Environment,
} from '@avocet/core';
import { DescriptionField, NameField } from '../../forms/DefinedFields';
import ControlledSelect from '#/components/forms/ControlledSelect';
import ControlledTextInput from '#/components/forms/ControlledTextInput';
import { Field } from '#/components/ui/field';
import { gqlRequest } from '#/lib/graphql-queries';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import {
  CREATE_SDK_CONNECTION,
  UPDATE_SDK_CONNECTION,
} from '#/lib/sdk-connection-queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PartialSdkConnectionWithId } from '#/graphql/graphql';

interface SDKConnectionManagementFormProps {
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sdkConnection?: SDKConnection;
}

/**
 * Create an sdk connection or update an existing one, if passed as an argument
 *
 * TODO:
 * - Revise allowed origins to be displayed as a set of boxes in a vertical list
 * - delete button on origin rows
 * - text box to add origins via submit button/enter key
 */
export default function SDKConnectionManagementForm({
  formId,
  setOpen,
  sdkConnection,
}: SDKConnectionManagementFormProps) {
  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
  });

  const environments: Environment[] = environmentsQuery.data ?? [];

  const defaultValues: SDKConnectionDraft =
    sdkConnection ??
    SDKConnectionDraft.template({
      name: '',
      environmentId: environments[0].id,
    });

  const formMethods = useForm<SDKConnectionDraft>({
    defaultValues,
  });

  const createSDKConnection = useMutation({
    mutationKey: ['allSDKConnections'],
    mutationFn: async (newEntry: SDKConnectionDraft) =>
      gqlRequest(CREATE_SDK_CONNECTION, { newEntry }),
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const updateSDKConnection = useMutation({
    mutationKey: ['allSDKConnections'],
    mutationFn: async (partialEntry: PartialSdkConnectionWithId) =>
      gqlRequest(UPDATE_SDK_CONNECTION, { partialEntry }),
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  if (environmentsQuery.isPending) return <Loader />;
  if (environmentsQuery.isError)
    return <ErrorBox error={environmentsQuery.error} />;

  if (environments.length === 0) {
    //TODO correctly handle no environments
    return <Text>No environments found. Please create one.</Text>;
  }

  const onSubmit: SubmitHandler<SDKConnectionDraft> = async (formContent) => {
    const clonedContent = structuredClone(formContent);
    if (clonedContent.environmentId.length !== 1)
      throw new Error('Lacks environment');

    clonedContent.environmentId = clonedContent.environmentId[0];
    clonedContent.allowedOrigins = clonedContent.allowedOrigins
      .split(',')
      .map((origin) => origin.trim()); //TODO

    const safeParseResult = sdkConnectionDraftSchema.safeParse(clonedContent);
    if (!safeParseResult.success) {
      // the error pretty-prints the Zod parse error message
      throw new SchemaParseError(safeParseResult);
    }

    if (sdkConnection) {
      updateSDKConnection.mutate({
        ...safeParseResult.data,
        id: sdkConnection.id,
      });
    } else {
      createSDKConnection.mutate(safeParseResult.data);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField label="Connection Name" />
          <DescriptionField />
          <ControlledSelect
            label="Environment"
            fieldPath="environmentId"
            options={environments.map((env) => {
              return { label: env.name, value: env.id };
            })}
          />
          <ControlledTextInput
            label="Comma-separated list of allowed origins"
            fieldPath="allowedOrigins"
            disabled={false}
            registerReturn={formMethods.register('allowedOrigins')}
          />
          <Field label="API Key">
            <Text>{formMethods.getValues('clientKeyHash')}</Text>
          </Field>
        </Stack>
      </form>
    </FormProvider>
  );
}
