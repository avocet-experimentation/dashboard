import { Button, Flex, Heading } from "@chakra-ui/react";

const Features = ({ children }) => {
  return (
    <Flex direction="column">
      <Flex>
        <Heading>Features</Heading>
        <Button>Add Feature</Button>
      </Flex>
      {children}
    </Flex>
  );
};

export default Features;
