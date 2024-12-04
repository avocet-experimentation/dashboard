import {
  createListCollection,
  Flex,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Field } from '../ui/field';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Environment,
  EnvironmentDraft,
  environmentDraftSchema,
  SchemaParseError,
} from '@estuary/types';
import EnvironmentService from '#/services/EnvironmentService';
import { useLocation } from 'wouter';

const environmentService = new EnvironmentService();

interface EnvironmentManagementFormProps {
  formId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // onSubmitSuccess: (environment: Environment, updated: boolean) => void;
  environment?: Environment;
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateEnvironment: (updated: Environment) => void;
}

/**
 * Create and update environments
 */
export default function EnvironmentManagementForm({
  formId,
  setIsLoading,
  setOpen,
  environment,
  setEnvironments,
  updateEnvironment,
}: EnvironmentManagementFormProps) {
  // const [isError, setIsError] = useState(null);
  // const [location, navigate] = useLocation();

  const defaultValues: EnvironmentDraft = environment ?? {
    name: '',
    defaultEnabled: false,
  };

  const {
    control,
    setValue,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Environment>({
    defaultValues,
  });

  const createOrUpdate = async (data: EnvironmentDraft) => {
    if (environment) {
      return environmentService.updateEnvironment(environment.id, data);
    } else {
      return environmentService.createEnvironment(data);
    }
  };

  const onSubmit: SubmitHandler<EnvironmentDraft> = async (
    environmentContent,
  ) => {
    // console.log('submit handler invoked');

    // console.log({ environmentContent });
    const safeParseResult =
      environmentDraftSchema.safeParse(environmentContent);
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
      // navigate('/environments');
      updateEnvironment(response.body);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  // const handleFormSubmitSuccess = (validatedEnvironment: Environment) => {
  //   setEnvironments((prevState) => {
  //     if (environment) {
  //       const updatedIndex = prevState.findIndex(
  //         (el) => el.id === validatedEnvironment.id,
  //       );
  //       if (updatedIndex === -1) {
  //         throw new Error(
  //           `Attempted to update environment ${validatedEnvironment.id}` +
  //             `, but no such environment was found`,
  //         );
  //       }
  //       const newState = [...prevState];
  //       newState.splice(updatedIndex, 1, validatedEnvironment);
  //       return newState;
  //     } else {
  //       return [...prevState, validatedEnvironment];
  //     }
  //   });
  // };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4">
        <Field
          label="Environment Name"
          invalid={!!errors.name}
          errorText={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={() => (
              <Input
                placeholder="environment"
                {...register('name', {
                  required:
                    'An environment name is required and must be between 3-20 characters long.',
                  pattern: {
                    value: /^[0-9A-Za-z-]+$/gi,
                    message:
                      'Environment names may only contain letters, numbers, and hyphens.',
                  },
                  minLength: 3,
                  maxLength: 20,
                })}
              />
            )}
          />
        </Field>
        <Controller
          name={`defaultEnabled`}
          control={control}
          render={({ field }) => (
            <Flex>
              <Text marginRight="5px">
                Enabled by default for new feature flags
              </Text>
              <Switch
                id="set-default-enabled"
                name={field.name}
                checked={!!field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                onBlur={field.onBlur}
                width="fit-content"
              />
            </Flex>
          )}
        />
        {/* );
          })}
        </Flex> */}
      </Stack>
    </form>
  );
}
