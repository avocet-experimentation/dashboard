import { Flex, Heading, Text } from '@chakra-ui/react';
import { SDKConnection } from '@avocet/core';
import { useContext, useEffect, useState } from 'react';
import { ServicesContext } from '#/services/ServiceContext';
import SDKConnectionTable from './table/SDKConnectionTable';
import SDKConnectionManagementModal from './management-form/SDKConnectionManagementModal';

/**
 * Parent component for Connections
 */
export default function SDKConnectionsMain() {
  const [sdkConnections, setSDKConnections] = useState<SDKConnection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { sdkConnection } = useContext(ServicesContext);

  const updateSDKConnection = (obj: SDKConnection) => {
    setSDKConnections((prevState) => {
      const index = prevState.find((el) => el.id === obj.id);
      if (index) {
        return prevState.map((el) => (el.id === obj.id ? obj : el));
      }
      return [...prevState, obj];
    });
  };

  useEffect(() => {
    const getAllSDKConnections = async () => {
      try {
        // const response = await sdkConnection.getMany();
        const response = {};
        const allSDKConnections = response.body ?? [];
        setSDKConnections(allSDKConnections);
      } catch (error) {
        console.log(error);
      }
    };

    getAllSDKConnections();
  }, []);

  return (
    <Flex direction="column" padding="25px" height="100vh" overflowY="scroll">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Connections</Heading>
        <SDKConnectionManagementModal
          setIsLoading={setIsLoading}
          updateSDKConnection={updateSDKConnection}
        />
      </Flex>
      <Text margin="15px 0">
        Defining user connections
      </Text>
      {sdkConnections.length ? (
        <SDKConnectionTable
          sdkConnections={sdkConnections}
          updateSDKConnection={updateSDKConnection}
          setIsLoading={setIsLoading}
        />
      ) : (
        'No connections found. Please create one.'
      )}
    </Flex>
  );
}
