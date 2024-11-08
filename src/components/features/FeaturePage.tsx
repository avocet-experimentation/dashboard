import FeatureService from "#/services/FeatureService";
import { createListCollection, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FeatureFlag } from "@estuary/types";
import { Switch } from "../ui/switch";
import { useRoute } from "wouter";

const featureService = new FeatureService();

const environments = createListCollection({
  items: ["dev", "prod", "testing"],
});

const FeaturePage = () => {
  const [feature, setFeature] = useState<FeatureFlag | null>(null);
  const [match, params] = useRoute("/features/:id");

  useEffect(() => {
    const handleGetFeature = async () => {
      try {
        const feature = await featureService.getFeature(params.id);
        setFeature(feature ?? null);
      } catch (error) {
        console.log(error);
      }
    };

    return () => handleGetFeature();
  }, []);

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
        <Flex direction="row">
          <Text>Type: {feature.valueType}</Text>
        </Flex>
        <Flex direction="column">
          <Heading size="xl">Enabled Environments</Heading>
          <Flex direction="column" padding="15px" bg="white" borderRadius="5px">
            <Text>
              In a disabled environment, the feature will always evaluate
              to&#20;
              <Text color="red" display="inline">
                null
              </Text>
              . The default value and override rules will be ignored.
            </Text>
            <Flex direction="row" width="100%">
              {Object.keys(feature.environments).map((env) => {
                const envObject = feature.environments[env];
                return (
                  <Flex position="relative" margin="0 15px 0 0">
                    <Text marginRight="5px">{`${env}:`}</Text>
                    <Switch
                      checked={envObject.enabled}
                      onCheckedChange={({ checked }) =>
                        featureService.patchFeature(feature.id, {
                          id: feature.id,
                          environments: { dev: { enabled: !checked } },
                        })
                      }
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Heading size="xl">Default Value</Heading>
          <Flex direction="column" padding="15px" bg="white" borderRadius="5px">
            <Text>
              In a disabled environment, the feature will always evaluate to
              null. The default value and override rules will be ignored.
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Heading size="xl">Override Rules</Heading>
          <Flex direction="column" padding="15px" bg="white" borderRadius="5px">
            <Text>
              Add powerful logic on top of your feature. The first matching rule
              applies and overrides the default value.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  } else {
    return <>This feature does not exist.</>;
  }
};

export default FeaturePage;
