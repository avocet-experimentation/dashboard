import FeatureService from "#/services/FeatureService";
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
} from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { FeatureFlag, FeatureFlagDraft } from "@estuary/types";
import { Check, EllipsisVertical, FilePenLine, Trash2, X } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import NotFound from "../NotFound";
import EnvironmentTabs from "./EnvironmentTabs";

const featureService = new FeatureService();

const VALUE_FONT = "'Lucida Console', 'Courier New', monospace";

export default function FeaturePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [feature, setFeature] = useState<FeatureFlag | null>(null);
  const [environments, setEnvironments] = useState<FeatureFlag['environmentNames']>();
  const [match, params] = useRoute("/features/:id");
  const [location, navigate] = useLocation();

  // todo: consider passing a prop in instead of using route params
  if (params === null) {
    throw new Error(`Missing 'id' param for component FeaturePage!`)
  }

  useEffect(() => {
    const handleGetFeature = async () => {
      try {
        const response = await featureService.getFeature(params.id);
        if (!response.ok) {
          // todo: replace this placeholder
          throw new Error(`Couldn't fetch flag data for id ${params.id}!`);
        } else {
          setFeature(response.body);
          setEnvironments(response.body.environmentNames);

        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    handleGetFeature();
    // return () => handleGetFeature();
  }, []);

  const handleDeleteFeature = () => {
    if (feature) {
      featureService.deleteFeature(feature.id);
      navigate("/features");
    }
  };

  // if (isLoading) return <></>;

  // if (feature) {
    return (<>
      {!isLoading &&
        feature ? 
      <Stack gap={4} padding="25px" overflowY="scroll">
        <Flex justifyContent="space-between">
          <Heading size="3xl">{feature.name}</Heading>
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
                _hover={{ bg: "bg.error", color: "fg.error" }}
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
              value={feature.description ?? ''}
              edit={editDesc}
              activationMode="focus"
              onBlur={() => {
                // setEditDesc(false);
              }}
              onSubmit={(event) => {
                console.log("submit");
                featureService.patchFeature(feature.id, {
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
                  <IconButton variant="outline" size="xs">
                    <X />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
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
                  query={["null"]}
                  styles={{ color: "red", fontFamily: VALUE_FONT }}
                >
                  In a disabled environment, the feature will always evaluate to
                  null. The default value and override rules will be ignored.
                </Highlight>
              </Text>
            </Flex>
            <Flex direction="row">
              {environments && Object.keys(environments).map((env) => {
                return (
                  <Flex
                    position="relative"
                    margin="0 15px 0 0"
                    key={`${env}-switch`}
                  >
                    <Text marginRight="5px">{env}:</Text>
                    <Switch
                      checked={env in environments}
                      onCheckedChange={async ({ checked }) => {
                        const toggleResult = await featureService.toggleEnvironment(feature.id, env);
                        if (toggleResult.ok) {
                          setEnvironments((prevState) => {
                            const prevEnv = prevState ?? {};
                            const prevFlag: FeatureFlagDraft = { ...feature, environmentNames: prevEnv };
                            if (checked === true) {
                              FeatureFlagDraft.enableEnvironment(prevFlag, env);
                            } else {
                              FeatureFlagDraft.disableEnvironment(prevFlag, env);

                            }
                            return prevFlag.environmentNames;
                          });
                        }
                      }}
                    />
                  </Flex>
                );
              })}
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
                {feature.value.type.toUpperCase()}
              </Text>
              <Text
                fontWeight="normal"
                fontFamily={VALUE_FONT}
                padding="0 10px"
              >
                {String(feature.value.initial)}
              </Text>
            </Flex>

            <Heading size="lg" margin="15px 0 0 0">
              Rules
            </Heading>
            <Text>
              Add powerful logic on top of your feature. The first matching rule
              applies and overrides the default value.
            </Text>
            <EnvironmentTabs
              {...feature}
              // featureId={params.id}
              // environmentNames={environments}
              // valueType={feature.value.type}
              // defaultValue={feature.value.initial}
            />
          </Stack>
        </Box>
      </Stack>
      : <NotFound componentName={"feature"} />}
      </>);
  // } else {
  //   return <NotFound componentName={"feature"} />;
  // }
};
