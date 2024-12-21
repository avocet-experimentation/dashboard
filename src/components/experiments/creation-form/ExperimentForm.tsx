import { useContext, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Experiment, ExperimentDraft, Treatment } from '@avocet/core';
import { ServicesContext } from '#/services/ServiceContext';
import { StepsContent, StepsItem, StepsList } from '../../ui/steps';
import ExperimentFormGeneralSection from './ExperimentFormGeneralSection';
import ExperimentFormTreatmentSection from './ExperimentFormTreatmentSection';
import { ALargeSmall, Users } from 'lucide-react';

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

interface ExperimentCreationFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExperimentCreationForm({
  formId,
  setIsLoading,
  setOpen,
}: ExperimentCreationFormProps) {
  const [expType, setExpType] = useState<'ab' | 'switchback'>('ab');
  const [formValues, setFormValues] = useState({
    ab: defaultAB,
    switchback: defaultSwitchback,
  });
  const services = useContext(ServicesContext);
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

  const onSubmit = async (expContent: ExperimentDraft) => {
    setIsLoading(true);
    // createGroupIds(expContent);
    try {
      reformatAllTrafficProportion(expContent);

      // todo: remove once no longer needed
      collectFeatureIds(expContent);
      if (expType === 'switchback') {
        expContent.groups[0].sequence = Object.keys(
          expContent.definedTreatments,
        );
      }
      console.log('data', expContent);
      // todo: handle failing responses
      const result = await services.experiment.create(expContent);
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
