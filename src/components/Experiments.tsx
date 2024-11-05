import { useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { CirclePlus } from "lucide-react";
import ExperimentCreationForm from "./ExperimentForm";

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

const Experiments = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Experiments</Heading>
        <Button onClick={() => setShowForm(true)} color="black">
          <CirclePlus />
          Create Experiment
        </Button>
      </Flex>
      <Text margin="25px 0">
        Experiments are useful for tracking and assessing feature performance.
      </Text>
      {showForm && (
        <>
          <ModalBackground />
          <ExperimentCreationForm setShowForm={setShowForm} />
        </>
      )}
    </Flex>
  );
};

export default Experiments;
