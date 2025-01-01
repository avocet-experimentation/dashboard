import { CirclePlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import { CREATE_EXPERIMENT } from '#/lib/experiment-queries';
import { gqlRequest } from '#/lib/graphql-queries';
import {
  ExperimentDraft,
  Experiment,
  experimentDraftSchema,
  SchemaParseError,
} from '@avocet/core';
import { Stack } from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useLocation } from 'wouter';
import ControlledSelect from '../forms/ControlledSelect';
import { NameField } from '../forms/DefinedFields';
import FormModal from '../forms/FormModal';
import { useCreateExperiment } from '#/hooks/query-hooks';

const CREATE_EXPERIMENT_FORM_ID = 'experiment-management-form';

export default function ExperimentInitModal() {
  const [open, setOpen] = useState(false);

  return (
    <FormModal
      triggerButtonIcon={<CirclePlus />}
      triggerButtonText="Create Experiment"
      title="Create a New Experiment"
      formId={CREATE_EXPERIMENT_FORM_ID}
      confirmButtonText="Create"
      open={open}
      setOpen={setOpen}
    >
      <ExperimentInitForm setOpen={setOpen} />
    </FormModal>
  );
}

/**
 * Create a new Experiment, requiring only the minimum fields
 */
function ExperimentInitForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [_, navigate] = useLocation();
  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
  });

  const createExperiment = useCreateExperiment({
    onSuccess: (data) => {
      setOpen(false);
      navigate(`/experiments/${data.createExperiment.id}`);
    },
  });

  const formMethods = useForm<Pick<Experiment, 'name' | 'environmentName'>>({
    defaultValues: {
      name: undefined,
      environmentName: undefined,
    },
  });

  const envCollection = useMemo(() => {
    const environments = environmentsQuery.data?.allEnvironments;
    if (!environments) return [];
    return environments.map((environment) => ({
      label: environment.name,
      value: environment.name,
    }));
  }, [environmentsQuery.data]);

  const onSubmit: SubmitHandler<
    Pick<Experiment, 'name' | 'environmentName'>
  > = async (formContent: Pick<Experiment, 'name' | 'environmentName'>) => {
    const draft = ExperimentDraft.template({
      ...formContent,
      environmentName: formContent.environmentName[0],
    });

    const safeParseResult = experimentDraftSchema.safeParse(draft);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    createExperiment.mutate(safeParseResult.data);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        id={CREATE_EXPERIMENT_FORM_ID}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <Stack gap="4">
          <NameField label="Experiment Name" />
          <ControlledSelect
            label="Select an Environment"
            fieldPath="environmentName"
            disabled={!environmentsQuery.isSuccess}
            options={envCollection}
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
