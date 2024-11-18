import { Flex, Heading, Text } from "@chakra-ui/react";
import { CirclePlus } from "lucide-react";
import FeatureCreationForm from "./FeatureForm";
import FormModalTrigger from "../FormModal";
import FeatureService from "#/services/FeatureService";
import { FeatureFlag } from "@estuary/types";
import { useEffect, useState } from "react";
import FeatureTable from "./FeatureTable";

const CREATE_FEATURE_FORM_ID = "create-feature-form";

const featureService = new FeatureService();

const Features = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    const handleGetAllFeatures = async () => {
      try {
        const allFeatures = await featureService.getAllFeatures();
        setFeatures(allFeatures ? await allFeatures.json() : []);
      } catch (error) {
        console.log(error);
      }
    };

    return () => handleGetAllFeatures();
  }, []);

  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Features</Heading>
        <FormModalTrigger
          triggerButtonIcon={<CirclePlus />}
          triggerButtonText={"Add Feature"}
          title={"Create a New Feature"}
          formId={CREATE_FEATURE_FORM_ID}
          confirmButtonText={"Create"}
        >
          <FeatureCreationForm
            formId={CREATE_FEATURE_FORM_ID}
            setIsLoading={undefined}
          />
        </FormModalTrigger>
      </Flex>
      <Text margin="15px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      {features.length ? (
        <FeatureTable features={features} />
      ) : (
        "No features found. Please create one."
      )}
    </Flex>
  );
};

export default Features;
