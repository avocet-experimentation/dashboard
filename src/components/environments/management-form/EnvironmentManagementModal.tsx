import { CirclePlus, CircleEllipsis } from 'lucide-react';
import { useState } from 'react';
import { Stack } from '@chakra-ui/react';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import {
  Environment,
  EnvironmentDraft,
  environmentDraftSchema,
  SchemaParseError,
} from '@avocet/core';
import FormModal from '#/components/forms/FormModal';
import { NameField } from '#/components/forms/DefinedFields';
import ControlledSwitch from '#/components/forms/ControlledSwitch';
import { CREATE_ENVIRONMENT } from '#/lib/environment-queries';
import { useMutation } from '@tanstack/react-query';
import { gqlRequest } from '#/lib/graphql-queries';
import { useUpdateEnvironment } from '#/hooks/update-hooks';

const ENVIRONMENT_MANAGEMENT_FORM_ID = 'environment-management-form';

interface EnvironmentManagementModalProps {
  environment?: Environment;
}

export default function EnvironmentManagementModal({
  environment,
}: EnvironmentManagementModalProps) {
  const [open, setOpen] = useState(false);

  const formModalProps = environment
    ? {
        title: `Modify "${environment?.name}" Environment`,
        confirmButtonText: 'Update',
        triggerButtonText: environment?.name,
        triggerButtonIcon: <CircleEllipsis />,
      }
    : {
        title: 'Create a New Environment',
        confirmButtonText: 'Create',
        triggerButtonText: 'Add Environment',
        triggerButtonIcon: <CirclePlus />,
      };

  return (
    <FormModal
      formId={ENVIRONMENT_MANAGEMENT_FORM_ID}
      open={open}
      setOpen={setOpen}
      {...formModalProps}
    >
      {environment ? (
        <EnvironmentManagementForm
          environment={environment}
          setOpen={setOpen}
        />
      ) : (
        <EnvironmentCreationForm setOpen={setOpen} />
      )}
    </FormModal>
  );
}

/**
 * Create a new Environment
 */
function EnvironmentCreationForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const createEnv = useMutation({
    mutationFn: async (newEntry: EnvironmentDraft) =>
      gqlRequest(CREATE_ENVIRONMENT, { newEntry }),
    mutationKey: ['allEnvironments'],
    onSuccess: () => setOpen(false),
    onError: (e: Error) => console.error(e), // TODO: handle errors better
  });

  const formMethods = useForm<Environment>({
    defaultValues: EnvironmentDraft.template({ name: '' }),
  });

  const onSubmit: SubmitHandler<EnvironmentDraft> = (environmentContent) => {
    const safeParseResult =
      environmentDraftSchema.safeParse(environmentContent);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    createEnv.mutate(safeParseResult.data);
  };

  return (
    <FormProvider {...formMethods}>
      <EnvironmentFormFields editing={false} handleFormSubmit={onSubmit} />
    </FormProvider>
  );
}

interface EnvironmentManagementFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  environment: Environment;
}

/**
 * Update an existing environment
 */
function EnvironmentManagementForm({
  setOpen,
  environment,
}: EnvironmentManagementFormProps) {
  const updateEnv = useUpdateEnvironment(environment.id, {
    onSuccess: () => setOpen(false),
    onError: (e: Error) => console.error(e), // TODO: handle errors better
  });

  const formMethods = useForm<Environment>({
    defaultValues: environment,
  });

  const onSubmit: SubmitHandler<EnvironmentDraft> = (formContent) => {
    const safeParseResult = environmentDraftSchema.safeParse(formContent);
    if (!safeParseResult.success) throw new SchemaParseError(safeParseResult);

    updateEnv.mutate(safeParseResult.data);
  };

  return (
    <FormProvider {...formMethods}>
      <EnvironmentFormFields editing={true} handleFormSubmit={onSubmit} />
    </FormProvider>
  );
}

function EnvironmentFormFields({
  editing,
  handleFormSubmit,
}: {
  editing: boolean;
  handleFormSubmit: SubmitHandler<EnvironmentDraft>;
}) {
  const { handleSubmit } = useFormContext<EnvironmentDraft>();

  return (
    <form
      id={ENVIRONMENT_MANAGEMENT_FORM_ID}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Stack gap="4">
        <NameField disabled={editing} label="Environment Name" />
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
  );
}
