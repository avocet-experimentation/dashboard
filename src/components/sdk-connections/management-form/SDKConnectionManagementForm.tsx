import { Stack, Text } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  sdkConnectionDraftSchema,
  SchemaParseError,
  SDKConnection,
  SDKConnectionDraft,
} from '@avocet/core';
import { useContext } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import { DescriptionField, NameField } from '../../forms/DefinedFields';
import ControlledSwitch from '../../forms/ControlledSwitch';
import { useEnvironmentContext } from '#/lib/EnvironmentContext';
import ControlledSelect from '#/components/forms/ControlledSelect';
import ControlledTextInput from '#/components/forms/ControlledTextInput';
import { Field } from '#/components/ui/field';

interface SDKConnectionManagementFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sdkConnection?: SDKConnection;
  updateConnection: (updated: SDKConnection) => void;
}

/**
 * Create an sdk connection or update an existing one, if passed as an argument
 */
export default function SDKConnectionManagementForm({
  formId,
  setIsLoading,
  setOpen,
  sdkConnection,
  updateConnection,
}: SDKConnectionManagementFormProps) {
  const services = useContext(ServicesContext);
  const { environments } = useEnvironmentContext();

  if (environments.length === 0) {
    //TODO correctly handle no environments
    return <></>;
  }

  const defaultValues: SDKConnectionDraft =
    sdkConnection ??
    SDKConnectionDraft.template({
      name: '',
      environmentId: environments[0].id,
    });

  const formMethods = useForm<SDKConnectionDraft>({
    defaultValues,
  });

  const createOrUpdate = async (data: SDKConnectionDraft) => {
    if (sdkConnection) {
      return services.sdkConnection.update(sdkConnection.id, data);
    }
    return services.sdkConnection.create(data);
  };

  const onSubmit: SubmitHandler<SDKConnectionDraft> = async (formContent) => {
    const clonedContent = structuredClone(formContent);
    if (clonedContent.environmentId.length !== 1)
      throw new Error('Lacks environment');

    clonedContent.environmentId = clonedContent.environmentId[0];
    clonedContent.allowedOrigins = clonedContent.allowedOrigins
      .split(',')
      .map((origin) => origin.trim());

    const safeParseResult = sdkConnectionDraftSchema.safeParse(clonedContent);
    if (!safeParseResult.success) {
      // the error pretty-prints the Zod parse error message
      throw new SchemaParseError(safeParseResult);
    }

    setIsLoading(true);
    try {
      const response = await createOrUpdate(safeParseResult.data);
      if (!response.ok) {
        // todo: handle errors correctly
        return;
      }
      updateConnection(response.body);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField disabled={!!sdkConnection} label="Connection Name" />
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
