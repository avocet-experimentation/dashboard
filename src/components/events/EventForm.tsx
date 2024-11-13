import { useState, useEffect } from "react";
import { Button, Stack, createListCollection } from "@chakra-ui/react"
import { Field } from "../ui/field"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select"
import { Controller, useForm } from "react-hook-form"
import EventService from '../../services/EventService';
// import { z } from "zod"

const eventService = new EventService();
const EventFilterForm = ({ onFormSubmit }) => {
  const [allEventTypes, setAllEventTypes] = useState(createListCollection({items: []}))
  const { control, handleSubmit } = useForm()
  
  useEffect(() => {
    const handleGetEvent = async () => {
      let result = (await eventService.getAllEventTypes());
      if (result === undefined) { result = [] }
      result.unshift('all events');
      const eventTypes = createListCollection({
        items: result
      });

      setAllEventTypes(eventTypes);
    }

    return () => handleGetEvent();
  }, []); 
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="4" align="flex-start">
        <Field
          label="Events"
          width="320px"
        >
          <Controller
            control={control}
            name="event"
            render={({ field }) => (
              <SelectRoot
                bg={"white"}
                color={"black"}
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={allEventTypes}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  {allEventTypes.items.map((event) => (
                    <SelectItem item={event} key={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>

        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  )
}

export default EventFilterForm;