import { createListCollection, Flex, Stack } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import {
  Environment,
  FeatureFlagDraft,
  featureFlagDraftSchema,
  SchemaParseError,
} from '@avocet/core';
import { useLocation } from 'wouter';
import { ServicesContext } from '#/services/ServiceContext';
import { Field } from '#/components/ui/field';
import FeatureFlagValueTypeField from './FeatureFlagValueTypeField';
import FeatureFlagDefaultValueField from './FeatureFlagDefaultValueField';
import { DescriptionField, NameField } from '#/components/forms/DefinedFields';
import ControlledSwitch from '#/components/forms/ControlledSwitch';
import { VALUE_TYPES_DISPLAY_LIST } from '../feature-constants';

interface FeatureFlagCreationFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  environments: Environment[];
}

export default function FeatureFlagCreationForm({
  formId,
  setIsLoading,
  setOpen,
  environments,
}: FeatureFlagCreationFormProps) {
  const [isError, setIsError] = useState(null);
  const [location, navigate] = useLocation();
  const services = useContext(ServicesContext);

  const pinnedEnvironments = createListCollection<string>({
    items: environments.filter((env) => env.pinToLists).map((env) => env.name),
  });

  console.log({ environments, pinnedEnvironments });
  const formMethods = useForm<FeatureFlagDraft>({
    defaultValues: FeatureFlagDraft.templateBoolean({
      name: '',
    }),
  });

  const onSubmit: SubmitHandler<FeatureFlagDraft> = async (featureContent) => {
    // console.log('submit handler invoked');

    try {
      // todo: remove this filtering once no longer needed
      const filteredEnvironmentNames = Object.fromEntries(
        Object.entries(featureContent.environmentNames).filter(
          ([, value]) => value === true,
        ),
      );

      const safeParseResult = featureFlagDraftSchema.safeParse({
        ...featureContent,
        environmentNames: filteredEnvironmentNames,
      });
      if (!safeParseResult.success) {
        // the error pretty-print the Zod parse error message
        throw new SchemaParseError(safeParseResult);
      }

      setIsLoading(true);
      const response = await services.featureFlag.createFeature(
        safeParseResult.data,
      );
      if (response.status === 409) {
        const { error } = await response.json();
        setIsError(error);
      } else if (response.ok) {
        const { fflagId } = response.body;
        navigate(`/features/${fflagId}`);
      }
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
          <NameField label="Feature Flag Name" />
          <DescriptionField />
          <Field label="Enabled Environments" as="p" />
          <Flex direction="row" width="100%" justifyContent="space-evenly">
            {pinnedEnvironments.items.map((env: string) => (
              <ControlledSwitch
                key={env}
                fieldPath={`environmentNames.${env}`}
                switchId={env}
                labelPosition="left"
                label={env}
              />
            ))}
          </Flex>
          <FeatureFlagValueTypeField
            control={formMethods.control}
            setValue={formMethods.setValue}
            valueTypes={VALUE_TYPES_DISPLAY_LIST}
          />
          <FeatureFlagDefaultValueField
            control={formMethods.control}
            getValues={formMethods.getValues}
            register={formMethods.register}
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
