import { Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  Environment,
  EnvironmentDraft,
  environmentDraftSchema,
  SchemaParseError,
} from '@estuary/types';
import { useContext } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import { NameField } from '../forms/DefinedFields';
import ControlledSwitch from '../forms/ControlledSwitch';

interface EnvironmentManagementFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  environment?: Environment;
  updateEnvironment: (updated: Environment) => void;
}

/**
 * Create an environment or update an existing one, if passed as an argument
 */
export default function EnvironmentManagementForm({
  formId,
  setIsLoading,
  setOpen,
  environment,
  updateEnvironment,
}: EnvironmentManagementFormProps) {
  // const [isError, setIsError] = useState(null);
  // const [location, navigate] = useLocation();
  const { environment: environmentService } = useContext(ServicesContext);

  const defaultValues: EnvironmentDraft = environment ?? EnvironmentDraft.template({ name: '' });

  const formMethods = useForm<Environment>({
    defaultValues,
  });

  const createOrUpdate = async (data: EnvironmentDraft) => {
    if (environment) {
      return environmentService.update(environment.id, data);
    }
    return environmentService.create(data);
  };

  const onSubmit: SubmitHandler<EnvironmentDraft> = async (
    environmentContent,
  ) => {
    // console.log('submit handler invoked');

    // console.log({ environmentContent });
    const safeParseResult = environmentDraftSchema.safeParse(environmentContent);
    if (!safeParseResult.success) {
      // the error pretty-print the Zod parse error message
      throw new SchemaParseError(safeParseResult);
    }

    setIsLoading(true);
    try {
      const response = await createOrUpdate(safeParseResult.data);
      // console.log({ response });
      if (!response.ok) {
        // todo: handle errors correctly
        return;
      }
      updateEnvironment(response.body);
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
          <NameField label="Environment Name" />
          <ControlledSwitch
            fieldPath="defaultEnabled"
            label="Enabled by default for new feature flags"
            labelPosition="left"
            switchId="set-default-enabled"
          />
          <ControlledSwitch
            fieldPath="pinToLists"
            label="Display a quick toggler on the feature flags list"
            labelPosition="left"
            switchId="set-pin-to-lists"
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
