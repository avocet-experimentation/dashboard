import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  ExperimentDraft,
  SchemaParseError,
  experimentDraftSchema,
} from '@avocet/core';
import { StepsContent, StepsItem, StepsList } from '../../ui/steps';
import ExperimentFormGeneralSection from './ExperimentFormGeneralSection';
import ExperimentFormTreatmentSection from './ExperimentFormTreatmentSection';
import { ALargeSmall, Users } from 'lucide-react';
import { useCreateExperiment } from '#/hooks/query-hooks';

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
  const [expType, setExpType] = useState<'ab' | 'switchback'>('ab');
  const [formValues, setFormValues] = useState({
    ab: defaultAB,
    switchback: defaultSwitchback,
  });

  const createExperiment = useCreateExperiment({
    onSuccess: () => setOpen(false),
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
