import { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import EventFilterForm from './EventForm'
import EventList from "../EventList";
import EventService from "#/services/EventService";

const Features = () => {
  const eventService = new EventService();

  const [eventData, setEventData] = useState([]);
  const handleFormSubmit = async (formData) => {
    // console.log('form data', formData);
    const result = await eventService.getEventsOfType(formData.event[0]);
    setEventData(result)
  }


  return (
    <Flex direction="column" padding="25px">
      <Flex
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="3xl">Event Data</Heading>
      </Flex>
      <Text margin="25px 0">
        Select which events you would like to see a record of:
        <EventFilterForm onFormSubmit={handleFormSubmit}></EventFilterForm>
      </Text>
      <Box overflowY="scroll">
        <EventList data={eventData}></EventList>
      </Box>
    </Flex>
  );
};

export default Features;
