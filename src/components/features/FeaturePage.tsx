import FeatureService from "#/services/FeatureService";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FeatureFlag, FlagEnvironment } from "@estuary/types";
import { Switch } from "../ui/switch";
import { useRoute } from "wouter";
import FeatureNotFound from "./FeatureNotFound";
import EnvironmentTabs from "./EnvironmentTabs";

const featureService = new FeatureService();

const FeaturePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feature, setFeature] = useState<FeatureFlag | null>(null);
  const [environments, setEnvironments] = useState<FlagEnvironment | null>(
    null
  );
  const [match, params] = useRoute("/features/:id");

  useEffect(() => {
    const handleGetFeature = async () => {
      try {
        const feature = await featureService.getFeature(params.id);
        console.log(feature);
        if (feature) {
          setFeature(feature ?? null);
          setEnvironments(feature.environments ?? null);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    return () => handleGetFeature();
  }, []);

  if (isLoading) return <></>;

  if (feature) {
    return (
      <Flex direction="column" padding="25px">
        <Flex
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="3xl">{feature.name}</Heading>
        </Flex>
        <Box margin="15px 0 0 0">
          <Heading size="xl">Overview</Heading>
          <Flex
            direction="column"
            padding="15px"
            bg="white"
            borderRadius="5px"
            margin="15px 0 0 0"
          >
            <Heading size="lg">Description</Heading>
            <Text width="100%" margin="5px 0 0 0">
              {feature.description}
            </Text>
          </Flex>
        </Box>
        <Box margin="15px 0 0 0">
          <Heading size="xl">Enabled Environments</Heading>
          <Flex
            direction="column"
            padding="15px"
            bg="white"
            borderRadius="5px"
            margin="15px 0 0 0"
          >
            <Text>
              In a disabled environment, the feature will always evaluate
              to&#20;
              <Text color="red" display="inline">
                null
              </Text>
              . The default value and override rules will be ignored.
            </Text>
            <Flex direction="row" width="100%" margin="15px 0 0 0">
              {Object.keys(environments).map((env) => {
                const envObject = environments[env];
                return (
                  <Flex
                    position="relative"
                    margin="0 15px 0 0"
                    key={`${env}-switch`}
                  >
                    <Text marginRight="5px">{`${env}:`}</Text>
                    <Switch
                      checked={envObject.enabled}
                      onCheckedChange={({ checked }) =>
                        featureService.patchFeature(
                          feature.id,
                          {
                            [`environments.${env}.enabled`]: checked,
                          },
                          () => {
                            setEnvironments((prevState) => ({
                              ...prevState,
                              [`${env}`]: {
                                ...prevState[`${env}`],
                                enabled: checked,
                              },
                            }));
                          }
                        )
                      }
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Box>

        <Box margin="15px 0 0 0">
          <Heading size="xl">Values and Rules</Heading>
          <Flex
            direction="column"
            padding="15px"
            bg="white"
            borderRadius="5px"
            margin="15px 0 0 0"
          >
            <Heading size="lg">Default Value</Heading>
            <Flex
              width="100%"
              border="1px solid gray"
              borderRadius="5px"
              padding="15px"
              alignContent="center"
              margin="5px 0 0 0"
            >
              <Text fontWeight="bold" width="fit-content" padding="0 5px">
                {feature.value.type.toUpperCase()}
              </Text>
              <Text
                fontWeight="normal"
                fontFamily="'Lucida Console', 'Courier New', monospace"
                padding="0 5px"
              >
                {String(feature.value.default)}
              </Text>
            </Flex>

            <Heading size="lg" margin="15px 0 0 0">
              Rules
            </Heading>
            <Text margin="5px 0 0 0">
              Add powerful logic on top of your feature. The first matching rule
              applies and overrides the default value.
            </Text>
            <EnvironmentTabs
              featureId={params.id}
              environments={environments}
              valueType={feature.value.type}
              defaultValue={feature.value.default}
            />
          </Flex>
        </Box>
        {/* <Flex direction="column">
          <Heading size="xl">Rules</Heading>
          <Flex
            direction="column"
            padding="15px"
            bg="white"
            borderRadius="5px"
          ></Flex>
        </Flex> */}
      </Flex>
    );
  } else {
    return <FeatureNotFound />;
  }
};

export default FeaturePage;
