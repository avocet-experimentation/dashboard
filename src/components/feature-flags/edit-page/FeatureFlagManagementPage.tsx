import {
  Box,
  EditableValueChangeDetails,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Environment, FeatureFlag, FeatureFlagDraft } from '@avocet/core';
import { CircleHelp, EllipsisVertical, Trash2 } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { VALUE_FONT } from '#/lib/constants';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '#/components/ui/menu';
import NotFound from '../../NotFound';
import EnvironmentTabs from './EnvironmentTabs';
import PageEditable from '../../forms/PageEditable';
import { FlagEnvironmentToggles } from './FlagEnvironmentToggles';
import { Tooltip } from '#/components/ui/tooltip';
import {
  DELETE_FEATURE_FLAG,
  gqlRequest,
  UPDATE_FEATURE_FLAG,
} from '#/lib/graphql-queries';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FeatureFlagProvider } from './FeatureFlagContext';
import { useFeatureFlag } from '#/hooks/query-hooks';

export default function FeatureFlagManagementPage() {
  const [, params] = useRoute('/features/:id');

  if (params === null) {
    throw new Error(`No params passed!`);
  }

  if (typeof params.id !== 'string') {
    throw new Error(`id "${params?.id}" is not a string!`);
  }

  const { isPending, isError, error, data } = useFeatureFlag(params.id);

  if (isPending) return <Loader label="Loading feature flag..." />;
  if (isError) return <ErrorBox error={error} />;

  if (!data) {
    return <NotFound componentName="Feature Flag" />;
  }

  return (
    <FeatureFlagProvider flagId={params.id}>
      <FlagManagementFields flag={data} />
    </FeatureFlagProvider>
  );
}

interface FlagManagementFieldsProps {
  flag: FeatureFlag;
}

function FlagManagementFields({ flag }: FlagManagementFieldsProps) {
  const [, navigate] = useLocation();

  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
    placeholderData: [] as Environment[],
  });

  const { mutate } = useMutation({
    mutationKey: ['featureFlag', flag.id],
    mutationFn: (partialEntry: Partial<FeatureFlagDraft>) =>
      gqlRequest(UPDATE_FEATURE_FLAG, {
        partialEntry: { ...partialEntry, id: flag.id },
      }),
    onError: (error) => {
      throw error; // TODO: handle failed updates better
    },
  });

  const deleteFlag = useMutation({
    mutationKey: ['allFeatureFlags'],
    mutationFn: async () => gqlRequest(DELETE_FEATURE_FLAG, { id: flag.id }),
    onSuccess: () => {
      navigate('/features');
    },
  });

  const environments: Environment[] = environmentsQuery.data ?? [];

  const handleEnvToggleChange = async (envName: string, checked: boolean) => {
    const updatedFlag = structuredClone(flag);
    if (checked) {
      FeatureFlagDraft.enableEnvironment(updatedFlag, envName);
    } else {
      FeatureFlagDraft.disableEnvironment(updatedFlag, envName);
    }

    mutate({
      environmentNames: updatedFlag.environmentNames,
    });
  };

  return (
    <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
      <Flex justifyContent="space-between">
        <Heading size="3xl">{flag.name}</Heading>
        <MenuRoot>
          <MenuTrigger asChild>
            <IconButton
              _open={{ bg: 'avocet-hover' }}
              _hover={{ bg: 'avocet-hover' }}
              bg="avocet-section"
              color="avocet-text"
              size="md"
            >
              <EllipsisVertical />
            </IconButton>
          </MenuTrigger>
          <MenuContent bg="avocet-section">
            <MenuItem
              value="delete"
              valueText="Delete"
              cursor="pointer"
              color="avocet-error-fg"
              _hover={{ bg: 'avocet-error-bg', color: 'avocet-error-fg' }}
              onClick={() => deleteFlag.mutate()}
            >
              <Trash2 />
              <Box flex="1">Delete</Box>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
      <Box>
        <Heading size="xl" marginBottom="15px">
          Overview
        </Heading>
        <PageEditable
          label="Description"
          initialValue={flag.description ?? ''}
          submitHandler={async (e: EditableValueChangeDetails) => {
            mutate({ description: e.value });
          }}
        />
      </Box>

      <FlagEnvironmentToggles
        environments={environments}
        featureFlag={flag}
        handleEnvToggleChange={handleEnvToggleChange}
      />

      <Box>
        <Heading size="xl" marginBottom="15px">
          Values and Rules
        </Heading>
        <Stack padding="15px" bg="avocet-section" borderRadius="5px">
          <Heading size="lg">Default Value</Heading>
          <Flex
            bg="avocet-bg"
            border="1px solid"
            borderRadius="5px"
            padding="15px"
          >
            <Text fontWeight="bold" width="fit-content" padding="0 5px">
              {flag.value.type.toUpperCase()}
            </Text>
            <Text fontWeight="normal" fontFamily={VALUE_FONT} padding="0 10px">
              {String(flag.value.initial)}
            </Text>
          </Flex>

          <Heading size="lg" margin="15px 0 0 0">
            <HStack gap={2.5}>
              Rules
              <Tooltip
                showArrow
                openDelay={50}
                content={
                  'Enable the flag in an environment to view and edit rules for it.'
                }
              >
                <Icon size="md">
                  <CircleHelp />
                </Icon>
              </Tooltip>
            </HStack>
          </Heading>
          <EnvironmentTabs featureFlag={flag} />
        </Stack>
      </Box>
    </Stack>
  );
}
