import { useEffect, useState } from 'react';
import {
  chakra,
  Fieldset,
  Input,
  Stack,
  HStack,
  createListCollection,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import {
  Experiment,
  FeatureFlag,
  Treatment,
  ExperimentDraft,
} from '@estuary/types';
import { RadioGroup, Radio } from '../ui/radio';
import { Field } from '../ui/field';

import FeatureService from '#/services/FeatureService';

import { Slider } from '../ui/slider';
import ExperimentService from '#/services/ExperimentService';
import ExpTypeForm from './ExpTypeForm';

interface FeatureCollection {
  label: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  initial: string | number | boolean;
}

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

const expService = new ExperimentService();
const featureService = new FeatureService();

const createTreatmentCollection = (definedTreatments: Treatment) => {
  const items = Object.entries(definedTreatments).map(([id, treatment]) => ({
    label: treatment.name,
    value: id,
  }));
  return createListCollection({ items });
};

const createFeatureCollection = (features: FeatureFlag[]) => {
  const items: FeatureCollection[] = features.map((feature) => ({
    label: feature.name,
    value: feature.id,
    type: feature.value.type,
    initial: feature.value.initial,
  }));
  return createListCollection({ items });
};

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
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Experiment>({
    defaultValues: formValues[expType],
  });
  const [treatmentsCollection, setTreatmentsCollection] = useState(
    createListCollection({ items: [] }),
  );
  const [featuresCollection, setFeaturesCollection] = useState(
    createListCollection<FeatureCollection>({ items: [] }),
  );

  // Save current form state before switching
  const handleSwitchForm = (newExpType: 'ab' | 'switchback') => {
    const currentValues = getValues();
    setFormValues((prevState) => ({
      ...prevState,
      [expType]: currentValues, // Save current form values
    }));
    setExpType(newExpType); // Update form type
  };

  // Handle form switching
  useEffect(() => {
    reset(formValues[expType]); // Use updated formValues for reset
  }, [expType, reset, getValues]);

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const allFeatures = await featureService.getAllFeatures();
        if (allFeatures.ok) {
          setFeaturesCollection(createFeatureCollection(allFeatures.body));
        }
        // setFeaturesCollection(
        //   allFeatures.ok
        //     ? createFeatureCollection(await allFeatures.body)
        //     : null,
        // );
      } catch (error) {
        console.log(error);
      }
    };

    handleGetAllFeatures();
  }, []);

  const definedTreatments = watch('definedTreatments');

  const groupValues = watch('groups');

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
      const result = await expService.createExperiment(expContent);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <chakra.form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Field
              label="Experiment Name"
              helperText={
                !errors.name
                  ? 'Acts as a unique identifier used to track impressions and analyze results.'
                  : null
              }
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="my-first-experiment"
                {...register('name', {
                  required:
                    'Experiment name is required and must be between 3-20 characters long.',
                  pattern: {
                    value: /^[0-9A-Za-z-]+$/gi,
                    message:
                      'Experiment names may only contain letters, numbers, and hyphens.',
                  },
                  minLength: 3,
                  maxLength: 20,
                })}
              />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Field
              label="Description"
              invalid={!!errors.description}
              errorText={errors.description?.message}
            >
              <Input
                placeholder="A human-readable description of your experiment."
                {...register('description', {
                  required: 'A description of your experiment is required.',
                })}
              />
            </Field>
          )}
        />
        <Controller
          name="hypothesis"
          control={control}
          render={() => (
            <Field
              label="Hypothesis"
              invalid={!!errors.hypothesis}
              errorText={errors.hypothesis?.message}
            >
              <Input
                placeholder="What do you expect to happen in this experiment ?"
                {...register('hypothesis', {
                  required: 'A hypothesis of your experiment is required.',
                })}
              />
            </Field>
          )}
        />
        {/* <Field
          label="Assign value based on attribute"
          helperText="Will be hashed together with the Tracking Key to determine which variation to assign."
        >
          <Controller
            control={control}
            name="featureFlag"
            render={({ field }) => {
              return (
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    field.onChange(value[0]);
                  }}
                  onInteractOutside={() => field.onBlur()}
                  collection={allFeatures}
                >
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent>
                    {allFeatures.items.map((feature) => (
                      <SelectItem item={feature.name} key={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              );
            }}
          />
        </Field> */}
        <Controller
          name="enrollment.proportion"
          control={control}
          render={({ field }) => (
            <Field
              label={`Traffic included in this experiment: ${field.value[0]}`}
            >
              <Slider
                cursor="grab"
                width="full"
                onFocusChange={({ focusedIndex }) => {
                  if (focusedIndex !== -1) return;
                  field.onBlur();
                }}
                name={field.name}
                value={[field.value]}
                onValueChange={({ value }) => {
                  field.onChange(value);
                }}
              />
            </Field>
          )}
        />
        <Fieldset.Root>
          <Fieldset.Legend>Experiment Type</Fieldset.Legend>
          <RadioGroup
            defaultValue={expType}
            onValueChange={({ value }) =>
              handleSwitchForm(value as 'ab' | 'switchback')}
          >
            <HStack gap="6">
              <Radio value="ab" cursor="pointer">
                A/B
              </Radio>
              <Radio value="switchback" cursor="pointer">
                Switchback
              </Radio>
            </HStack>
          </RadioGroup>
        </Fieldset.Root>
        <ExpTypeForm
          control={control}
          createTreatmentCollection={createTreatmentCollection}
          definedTreatments={definedTreatments}
          errors={errors}
          expType={expType}
          featuresCollection={featuresCollection}
          groupValues={groupValues}
          setValue={setValue}
          register={register}
        />
      </Stack>
    </chakra.form>
  );
}
