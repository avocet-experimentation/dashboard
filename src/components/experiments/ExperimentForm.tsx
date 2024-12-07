import { useContext, useEffect, useState } from 'react';
import { Group } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { Experiment, ExperimentDraft, Treatment } from '@estuary/types';
import { ServicesContext } from '#/services/ServiceContext';
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
  StepsPrevTrigger,
  StepsNextTrigger,
} from '../ui/steps';
import ExperimentFormGeneralSection from './ExperimentFormGeneralSection';
import ExperimentFormTreatmentSection from './ExperimentFormTreatmentSection';
import { Button } from '../ui/button';
import { ALargeSmall, Users } from 'lucide-react';

export type ExperimentType = 'ab' | 'switchback';
export type DefinedTreatments = Record<string, Treatment>;

const templateToObject = (template: ExperimentDraft) =>
  Object.getOwnPropertyNames(template).reduce((acc, prop) => {
    acc[prop] = template[prop];
    return acc;
  }, {});

const abTemplate = ExperimentDraft.templateAB({
  name: 'my-first-exp',
  environmentName: 'dev',
});

const defaultAB = templateToObject(abTemplate);

const switchbackTemplate = ExperimentDraft.templateSwitchback({
  name: 'my-first-switchback',
  environmentName: 'dev',
});

const defaultSwitchback = templateToObject(switchbackTemplate);

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
  });

  // Handle form switching
  useEffect(() => {
    formMethods.reset(formValues[expType]); // Use updated formValues for reset
  }, [expType, formMethods.reset]);

  const definedTreatments = formMethods.watch('definedTreatments');

  const onSubmit = async (expContent: Experiment) => {
    setIsLoading(true);
    // createGroupIds(expContent);
    try {
      reformatAllTrafficProportion(expContent);
      collectFeatureIds(expContent);
      if (expType === 'switchback') {
        expContent.groups[0].sequence = Object.keys(
          expContent.definedTreatments,
        );
      }
      console.log('data', expContent);
      const result = await services.experiment.createExperiment(expContent);
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
            definedTreatments={definedTreatments}
            expType={expType}
            setExpType={setExpType}
            setFormValues={setFormValues}
          />
        </StepsContent>
      </form>
    </FormProvider>
  );
}