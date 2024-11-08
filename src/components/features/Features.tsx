import { Flex, Heading, Text } from "@chakra-ui/react";
import { CirclePlus } from "lucide-react";
import FeatureCreationForm from "./FeatureForm";
import FormModalTrigger from "../Modal";

const CREATE_FEATURE_FORM_ID = "create-feature-form";

const Features = ({ children }) => {
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
          form={<FeatureCreationForm formId={CREATE_FEATURE_FORM_ID} />}
          formId={CREATE_FEATURE_FORM_ID}
          confirmButtonText={"Create"}
        />
      </Flex>
      <Text margin="25px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      {children}
    </Flex>
  );
};

export default Features;
