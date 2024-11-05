import { useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { CirclePlus } from "lucide-react";
import FeatureCreationForm from "./FeatureForm";

const ModalBackground = () => {
  return (
    <Box
      bg="gray"
      opacity="0.5"
      width="100%"
      height="100%"
      position="absolute"
      top="0"
      left="0"
    ></Box>
  );
};

const Features = ({ children }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Features</Heading>
        <Button onClick={() => setShowForm(true)} color="black">
          <CirclePlus />
          Add Feature
        </Button>
      </Flex>
      <Text margin="25px 0">
        Features enable you to change your app's behavior from within this UI.
      </Text>
      {children}
      {showForm && (
        <>
          <ModalBackground />
          <FeatureCreationForm setShowForm={setShowForm} />
        </>
      )}
    </Flex>
  );
};

export default Features;
