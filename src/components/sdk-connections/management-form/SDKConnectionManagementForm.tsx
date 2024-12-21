import { Stack } from '@chakra-ui/react';
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
  const { environment: environmentService } = useContext(ServicesContext);

  const defaultValues: SDKConnectionDraft =
    sdkConnection ?? SDKConnectionDraft.template({ name: ''  });

  const formMethods = useForm<SDKConnection>({
    defaultValues,
  });

  // const createOrUpdate = async (data: SDKConnectionDraft) => {
  //   if (sdkConnection) {
  //     return environmentService.update(sdkConnection.id, data);
  //   }
  //   return environmentService.create(data);
  // };

  const onSubmit: SubmitHandler<SDKConnectionDraft> = async (
    formContent,
  ) => {
    const safeParseResult =
      sdkConnectionDraftSchema.safeParse(formContent);
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
