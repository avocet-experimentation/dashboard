import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Experiment,
  ExperimentDraft,
  SchemaParseError,
  experimentDraftSchema,
} from '@avocet/core';
import { StepsContent, StepsItem, StepsList } from '../../ui/steps';
import ExperimentFormGeneralSection from './ExperimentFormGeneralSection';
import ExperimentFormTreatmentSection from './ExperimentFormTreatmentSection';
import { ALargeSmall, Users } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { CREATE_EXPERIMENT, gqlRequest } from '#/lib/graphql-queries';
import { useLocation } from 'wouter';

export type ExperimentType = 'ab' | 'switchback';

const defaultAB = ExperimentDraft.templateAB({
  name: 'my-first-exp',
  environmentName: 'dev',
});

const defaultSwitchback = ExperimentDraft.templateSwitchback({
  name: 'my-first-switchback',
  environmentName: 'dev',
});

// mutating function
const reformatAllTrafficProportion = (expContent: ExperimentDraft): void => {
  const originalProportion = expContent.enrollment.proportion;
  const reformatted = parseFloat((originalProportion / 100).toFixed(2));
  expContent.enrollment.proportion = reformatted;
};

// mutating function
const collectFeatureIds = (expContent: ExperimentDraft): void => {
  const firstTreatment = Object.keys(expContent.definedTreatments)[0];
  const collectedIds = expContent.definedTreatments[
    firstTreatment
  ].flagStates.map((feature) => feature.id);
  expContent.flagIds = collectedIds;
};

const processedDraft = (expContent: ExperimentDraft): ExperimentDraft => {
  const content = structuredClone(expContent);
  // createGroupIds(content);
  reformatAllTrafficProportion(content);
  collectFeatureIds(content);
  const safeParseResult = experimentDraftSchema.safeParse(content);
  if (!safeParseResult.success) {
    throw new SchemaParseError(safeParseResult);
  }

  return safeParseResult.data;
};

interface ExperimentCreationFormProps {
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentCreationForm({
  formId,
  setOpen,
}: ExperimentCreationFormProps) {
  const [location, setLocation] = useLocation();
  const [expType, setExpType] = useState<'ab' | 'switchback'>('ab');
  const [formValues, setFormValues] = useState({
    ab: defaultAB,
    switchback: defaultSwitchback,
  });

  const createExperiment = useMutation({
    mutationKey: ['allExperiments'],
    mutationFn: async (newEntry: ExperimentDraft) =>
      gqlRequest(CREATE_EXPERIMENT, { newEntry }),
    onSuccess: (data: Experiment) => {
      setOpen(false);
      setLocation(`/experiments/${data.id}`);
    },
  });

  const formMethods = useForm<ExperimentDraft>({
    defaultValues: formValues[expType],
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    shouldUnregister: false,
  });

  // Handle form switching
  useEffect(() => {
    formMethods.reset(formValues[expType]); // Use updated formValues for reset
  }, [expType, formMethods.reset]);

  const definedTreatments = formMethods.watch('definedTreatments');

  return (
    <FormProvider {...formMethods}>
      <form
        id={formId}
        onSubmit={formMethods.handleSubmit((draft) =>
          createExperiment.mutate(processedDraft(draft)),
        )}
      >
        <StepsList>
          <StepsItem
            index={0}
            title="General"
            icon={<ALargeSmall />}
          ></StepsItem>
          <StepsItem
            index={1}
            title="Treatments/Groups"
            icon={<Users />}
          ></StepsItem>
        </StepsList>
        <StepsContent index={0}>
          <ExperimentFormGeneralSection />
        </StepsContent>
        <StepsContent index={1}>
          <ExperimentFormTreatmentSection
            expType={expType}
            setExpType={setExpType}
            setFormValues={setFormValues}
          />
        </StepsContent>
      </form>
    </FormProvider>
  );
}
