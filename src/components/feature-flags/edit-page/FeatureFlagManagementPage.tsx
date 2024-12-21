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
import { useContext, useEffect, useState } from 'react';
import { Environment, FeatureFlag, FeatureFlagDraft } from '@avocet/core';
import { CircleHelp, EllipsisVertical, Trash2 } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import deepcopy from 'deepcopy';
import { ServicesContext } from '#/services/ServiceContext';
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

interface FeatureFlagManagementPageProps {
  // environments: Environment[];
}

export default function FeatureFlagManagementPage(
  {
    // environments,
  }: FeatureFlagManagementPageProps,
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag>();
  const [environments, setEnvironments] = useState<Environment[]>();
  const [match, params] = useRoute('/features/:id');
  const [location, navigate] = useLocation();
  const services = useContext(ServicesContext);

  // todo: consider passing a prop in instead of using route params
  if (params === null) {
    throw new Error("Missing 'id' param!");
  }

  const handleFlagUpdate = async (
    updates: Partial<FeatureFlagDraft>,
  ): Promise<boolean> => {
    const flagResponse = await services.featureFlag.updateFeature(
      params.id,
      updates,
    );

    return flagResponse.ok;
  };

  const handleGetFeature = async () => {
    setIsLoading(true);
    try {
      const flagResponse = await services.featureFlag.getFeature(params.id);
      if (!flagResponse.ok) {
        // todo: better error handling
        throw new Error(`Couldn't fetch flag data for id ${params.id}!`);
      }

      const envResponse = await services.environment.getMany();
      // todo: better error handling
      if (!envResponse.ok) throw new Error("Couldn't load environments!");

      setFeatureFlag(flagResponse.body);
      setEnvironments(envResponse.body);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeature();
    // return () => handleGetFeature();
  }, []);

  const handleDeleteFeature = () => {
    if (featureFlag) {
      services.featureFlag.deleteFeature(featureFlag.id);
      navigate('/features');
    }
  };

  const handleEnvToggleChange = async (envName: string, checked: boolean) => {
    if (!featureFlag) {
      throw new Error('Feature flag was not set on state');
    }
    try {
      const response = await services.featureFlag.toggleEnvironment(
        params.id,
        envName,
      );
      if (!response.ok) {
        throw new Error(`Failed to update record for flag ${params.id}`);
      }

      setFeatureFlag((prevState) => {
        if (!prevState)
          throw new Error(
            'Attempted to update flag before it was set on state!',
          );
        const updatedFlag = deepcopy(prevState);
        FeatureFlagDraft.toggleEnvironment(updatedFlag, envName);
        return updatedFlag;
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {!isLoading && featureFlag ? (
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
                  onClick={handleDeleteFeature}
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
            <ControlledEditable
              label="Description"
              initialValue={featureFlag.description ?? ''}
              submitHandler={async (e: EditableValueChangeDetails) => {
                const success = await handleFlagUpdate({
                  description: e.value,
                });
                return success ? e.value : (featureFlag.description ?? '');
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
      ) : (
        <NotFound componentName="feature" />
      )}
    </>
  );
}
