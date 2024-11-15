import { Flex, chakra, Text } from "@chakra-ui/react";
import SearchX from "../../assets/svgs/search-x.svg";

const FeatureNotFound = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <chakra.img src={SearchX} width="150px" draggable={false} />
      <Text fontSize="3xl">
        The feature you are looking for does not exist.
      </Text>
    </Flex>
  );
};

export default FeatureNotFound;
