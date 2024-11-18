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
import { FeatureFlag, Environment } from "@estuary/types";
import { Check, EllipsisVertical, FilePenLine, Trash2, X } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import FeatureNotFound from "./FeatureNotFound";
import EnvironmentTabs from "./EnvironmentTabs";

const featureService = new FeatureService();

const VALUE_FONT = "'Lucida Console', 'Courier New', monospace";

const FeaturePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [feature, setFeature] = useState<FeatureFlag | null>(null);
  const [environments, setEnvironments] = useState<Environment | null>(null);
  const [match, params] = useRoute("/features/:id");
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleGetFeature = async () => {
      try {
        const response = await featureService.getFeature(params.id);
        const resFeature = await response.json();
        if (resFeature) {
          setFeature(resFeature ?? null);
          setEnvironments(resFeature.environments ?? null);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    return () => handleGetFeature();
  }, []);

  const handleDeleteFeature = () => {
    featureService.deleteFeature(feature.id);
    navigate("/features");
  };

  if (isLoading) return <></>;

  if (feature) {
    return (
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
              defaultValue={feature.description}
              edit={editDesc}
              activationMode="focus"
              onBlur={() => setEditDesc(false)}
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
                <Editable.SubmitTrigger
                  asChild
                  onClick={(value) => {
                    featureService.patchFeature(feature.id, {
                      description: value,
                    });
                  }}
                >
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
              {Object.keys(environments).map((env) => {
                const envObject = environments[env];
                return (
                  <Flex
                    position="relative"
                    margin="0 15px 0 0"
                    key={`${env}-switch`}
                  >
                    <Text marginRight="5px">{env}:</Text>
                    <Switch
                      checked={envObject.enabled}
                      onCheckedChange={({ checked }) => {
                        featureService.patchFeature(feature.id, {
                          // [`environments.${env}.enabled`]: checked,
                          environments: {
                            [`${env}`]: {
                              enabled: checked,
                              name: envObject.name,
                              overrideRules: envObject.overrideRules,
                            },
                          },
                        });
                        setEnvironments((prevState) => ({
                          ...prevState,
                          [`${env}`]: {
                            ...prevState[`${env}`],
                            enabled: checked,
                          },
                        }));
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
              featureId={params.id}
              environments={environments}
              valueType={feature.value.type}
              defaultValue={feature.value.initial}
            />
          </Stack>
        </Box>
      </Stack>
    );
  } else {
    return <FeatureNotFound />;
  }
};

export default FeaturePage;
