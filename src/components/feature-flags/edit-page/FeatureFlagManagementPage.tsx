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
import { Environment, FeatureFlagDraft, featureFlagSchema } from '@avocet/core';
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
  FEATURE_FLAG,
  gqlRequest,
  UPDATE_FEATURE_FLAG,
} from '#/lib/graphql-queries';
import { ALL_ENVIRONMENTS } from '#/lib/environment-queries';
import Loader from '#/components/helpers/Loader';
import ErrorBox from '#/components/helpers/ErrorBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PartialFeatureFlagWithId } from '#/graphql/graphql';

interface FeatureFlagManagementPageProps {
  // environments: Environment[];
}

export default function FeatureFlagManagementPage(
  {
    // environments,
  }: FeatureFlagManagementPageProps,
) {
  const [, params] = useRoute('/features/:id');
  const [, navigate] = useLocation();

  if (params === null) {
    throw new Error("Missing 'id' param!");
  }

  const { isPending, isError, error, data } = useQuery({
    queryKey: ['featureFlag', { id: params.id }],
    queryFn: async () => gqlRequest(FEATURE_FLAG, { id: params.id }),
    select: (data) => data.featureFlag,
  });

  const environmentsQuery = useQuery({
    queryKey: ['allEnvironments'],
    queryFn: async () => gqlRequest(ALL_ENVIRONMENTS, {}),
    select: (data) => data.allEnvironments,
    placeholderData: { allEnvironments: [] } as {
      allEnvironments: Environment[];
    },
  });

  const { mutate } = useMutation({
    mutationKey: ['allFeatureFlags'],
    mutationFn: (partialEntry: PartialFeatureFlagWithId) =>
      gqlRequest(UPDATE_FEATURE_FLAG, { partialEntry }),
    onError: (error) => {
      throw error; // TODO: handle failed updates better
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ['allFeatureFlags'],
    mutationFn: async (id: string) => gqlRequest(DELETE_FEATURE_FLAG, { id }),
    onSuccess: () => {
      navigate('/features');
    },
  });

  if (isPending) return <Loader />;
  if (isError) return <ErrorBox error={error} />;
  if (data === null) return <NotFound componentName="feature" />;

  const featureFlag = featureFlagSchema.parse(data);
  const environments = environmentsQuery.data;

  const handleEnvToggleChange = async (envName: string, checked: boolean) => {
    if (!featureFlag) {
      throw new Error('Feature flag was not set on state');
    }

    const updatedFlag = structuredClone(featureFlag);
    if (checked) {
      FeatureFlagDraft.enableEnvironment(updatedFlag, envName);
    } else {
      FeatureFlagDraft.disableEnvironment(updatedFlag, envName);
    }

    mutate({
      id: featureFlag.id,
      environmentNames: updatedFlag.environmentNames,
    });
  };

  return (
    <>
      {featureFlag && (
        <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
          <Flex justifyContent="space-between">
            <Heading size="3xl">{featureFlag.name}</Heading>
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton size="md">
                  <EllipsisVertical color="black" />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  value="delete"
                  valueText="Delete"
                  cursor="pointer"
                  color="fg.error"
                  _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  onClick={() => deleteMutation.mutate(featureFlag.id)}
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
              initialValue={featureFlag.description ?? ''}
              submitHandler={async (e: EditableValueChangeDetails) => {
                mutate({ id: featureFlag.id, description: e.value });
              }}
            />
          </Box>

          <FlagEnvironmentToggles
            environments={environments}
            featureFlag={featureFlag}
            handleEnvToggleChange={handleEnvToggleChange}
          />

          <Box>
            <Heading size="xl" marginBottom="15px">
              Values and Rules
            </Heading>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <Heading size="lg">Default Value</Heading>
              <Flex border="1px solid gray" borderRadius="5px" padding="15px">
                <Text fontWeight="bold" width="fit-content" padding="0 5px">
                  {featureFlag.value.type.toUpperCase()}
                </Text>
                <Text
                  fontWeight="normal"
                  fontFamily={VALUE_FONT}
                  padding="0 10px"
                >
                  {String(featureFlag.value.initial)}
                </Text>
              </Flex>

              <Heading size="lg" margin="15px 0 0 0">
                <HStack gap={2.5}>
                  Rules{' '}
                  <Tooltip
                    showArrow
                    openDelay={50}
                    content={
                      'Only enabled environments will only be shown. Enable an environment to view and edit its rules.'
                    }
                  >
                    <Icon size="md">
                      <CircleHelp />
                    </Icon>
                  </Tooltip>
                </HStack>
              </Heading>
              <EnvironmentTabs featureFlag={featureFlag} />
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}
