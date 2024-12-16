import { createListCollection, ListCollection, Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  Environment,
  EnvironmentDraft,
  environmentDraftSchema,
  Experiment,
  ExperimentDraft,
  SchemaParseError,
} from '@avocet/core';
import { useContext, useEffect, useState } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import { DescriptionField, NameField } from '#/components/forms/DefinedFields';
import ControlledSwitch from '#/components/forms/ControlledSwitch';
import ControlledSelect from '../forms/ControlledSelect';
import { useLocation } from 'wouter';

interface ExperimentInitFormProps {
  formId: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Create an environment or update an existing one, if passed as an argument
 */
export default function ExperimentInitForm({
  formId,
  isLoading,
  setIsLoading,
  setOpen,
}: ExperimentInitFormProps) {
  // const [isError, setIsError] = useState(null);
  const [location, navigate] = useLocation();
  // const [experimentName, setExperimentName] = useState<string>();
  const [environmentOptions, setEnvironmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { environment: environmentService, experiment: experimentService } =
    useContext(ServicesContext);

  const formMethods = useForm<Pick<Experiment, 'name' | 'environmentName'>>({
    defaultValues: {
      name: undefined,
      environmentName: undefined,
    },
  });

  useEffect(() => {
    const fetchEnvironments = async () => {
      setIsLoading(true);
      try {
      } finally {
        setIsLoading(false);
      }
      const response = await environmentService.getMany();
      if (!response.ok) {
        // todo: handle error
        console.error(response);
      }

      const environments = response.body ?? [];

      setEnvironmentOptions(
        environments.map((environment) => ({
          label: environment.name,
          value: environment.name,
        })),
      );
    };

    fetchEnvironments();
  }, []);

  const onSubmit: SubmitHandler<
    Pick<Experiment, 'name' | 'environmentName'>
  > = async (formContent: Pick<Experiment, 'name' | 'environmentName'>) => {
    console.log('submit handler invoked');
    console.log({ formContent });

    // const safeParseResult = environmentDraftSchema.safeParse(formContent);
    // if (!safeParseResult.success) {
    //   // the error pretty-print the Zod parse error message
    //   throw new SchemaParseError(safeParseResult);
    // }

    const draft = ExperimentDraft.template({
      ...formContent,
      environmentName: formContent.environmentName[0],
    });

    setIsLoading(true);
    let experimentId;
    try {
      const response = await experimentService.create(draft);
      if (!response.ok) {
        // todo: handle errors correctly
        return;
      }

      experimentId = response.body;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setOpen(false);
      if (experimentId) {
        navigate(`/experiments/${experimentId}`);
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form id={formId} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack gap="4">
          <NameField label="Experiment Name" />
          <ControlledSelect
            label="Select an Environment"
            fieldPath="environmentName"
            disabled={isLoading}
            options={environmentOptions}
            handleValueChange={(value) => {
              console.log({ value });
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
