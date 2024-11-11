import { Flex, Text } from "@chakra-ui/react";
import { SearchX } from "lucide-react";

const FeatureNotFound = () => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Flex direction="row">
        <SearchX />
        <Text>The feature you are looking for does not exist.</Text>
      </Flex>
    </Flex>
  );
};

export default FeatureNotFound;
