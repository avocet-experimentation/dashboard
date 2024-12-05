import {
  Box,
  Editable,
  Flex,
  Heading,
  Highlight,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Environment, FeatureFlag, FeatureFlagDraft } from '@estuary/types';
import {
  Check, EllipsisVertical, FilePenLine, Trash2, X,
} from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import deepcopy from 'deepcopy';
import deepmerge from 'deepmerge';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '../ui/switch';
import {
  MenuContent, MenuItem, MenuRoot, MenuTrigger,
} from '../ui/menu';
import NotFound from '../NotFound';
import EnvironmentTabs from './EnvironmentTabs';

const VALUE_FONT = "'Lucida Console', 'Courier New', monospace";

interface FeatureFlagManagementPageProps {
  // environments: Environment[];
}

export default function FeatureFlagManagementPage(
  {
    // environments,
  }: FeatureFlagManagementPageProps,
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag>();
  const [environments, setEnvironments] = useState<Environment[]>();
  const [match, params] = useRoute('/features/:id');
  const [location, navigate] = useLocation();
  const services = useContext(ServicesContext);

  // todo: consider passing a prop in instead of using route params
  if (params === null) {
    throw new Error("Missing 'id' param!");
  }

  useEffect(() => {
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

    handleGetFeature();
    // return () => handleGetFeature();
  }, []);

  const handleDeleteFeature = () => {
    if (featureFlag) {
      services.featureFlag.deleteFeature(featureFlag.id);
      navigate('/features');
    }
  };

  const cancelHandler = (flag: FeatureFlag) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      if (textarea.value !== undefined) textarea.value = flag.description;
      textarea.blur();
    }
    console.log('cancel clicked, reset to:', flag.description);
    setEditDesc(false);
  };

  const submitHandler = (flag: FeatureFlag) => {
    const newValue = document.querySelector('textarea')?.value || flag.description;
    console.log('value:', { newValue });
    services.featureFlag.patchFeature(flag.id, { description: newValue });
    setEditDesc(false);
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
      const updatedFlag = deepcopy(featureFlag);
      FeatureFlagDraft.toggleEnvironment(updatedFlag, envName);

      setFeatureFlag(updatedFlag);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {!isLoading && featureFlag ? (
        <Stack gap={4} padding="25px" overflowY="scroll">
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
            <Stack padding="15px" bg="white" borderRadius="5px">
              <HStack gap={2.5}>
                <Heading size="lg">Description</Heading>
                <Icon
                  size="sm"
                  cursor="pointer"
                  onClick={() => setEditDesc(true)}
                >
                  <FilePenLine color="black" />
                </Icon>
              </HStack>
              <Editable.Root
                value={featureFlag.description ?? ''}
                edit={editDesc}
                activationMode="focus"
                onBlur={() => {
                  // setEditDesc(false);
                }}
                onSubmit={(event) => {
                  console.log('submit');
                  services.featureFlag.patchFeature(featureFlag.id, {
                    description: event.target.value,
                  });
                }}
              >
                <Editable.Preview
                  minH="48px"
                  alignItems="flex-start"
                  width="full"
                />
                <Editable.Textarea />
                <Editable.Control>
                  <Editable.CancelTrigger asChild>
                    <IconButton
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        cancelHandler(featureFlag);
                      }}
                    >
                      <X />
                    </IconButton>
                  </Editable.CancelTrigger>
                  <Editable.SubmitTrigger asChild>
                    <IconButton
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        submitHandler(featureFlag);
                      }}
                    >
                      <Check />
                    </IconButton>
                  </Editable.SubmitTrigger>
                </Editable.Control>
              </Editable.Root>
            </Stack>
          </Box>
          <Box>
            <Heading size="xl" marginBottom="15px">
              Enabled Environments
            </Heading>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <Flex>
                <Text>
                  <Highlight
                    query={['null']}
                    styles={{ color: 'red', fontFamily: VALUE_FONT }}
                  >
                    In a disabled environment, the feature will always evaluate
                    to null. The default value and override rules will be
                    ignored.
                  </Highlight>
                </Text>
              </Flex>
              <Flex direction="row">
                {environments
                  && environments.map((env) => (
                    <Flex
                      position="relative"
                      margin="0 15px 0 0"
                      key={`${env.name}-switch`}
                    >
                      <Text marginRight="5px">
                        {env.name}
                        :
                      </Text>
                      <Switch
                        checked={env.name in featureFlag.environmentNames}
                        onCheckedChange={async ({ checked }) =>
                          handleEnvToggleChange(env.name, checked)}
                      />
                    </Flex>
                  ))}
              </Flex>
            </Stack>
          </Box>

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
                Rules
              </Heading>
              <Text>
                Add powerful logic on top of your feature. The first matching
                rule applies and overrides the default value.
              </Text>
              <EnvironmentTabs featureFlag={featureFlag} />
            </Stack>
          </Box>
        </Stack>
      ) : (
        <NotFound componentName="feature" />
      )}
    </div>
  );
}
