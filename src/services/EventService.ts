export default class EventService {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_EVENT_SERVICE_URL;
  }

  async getAllEvents() {
    try {
      console.log(this.baseUrl)
      const response = await fetch(this.baseUrl + '/events');
      console.log(response)
      const allEvents = (await response.json())._rs.rows;
      console.log({allEvents})
      return allEvents;
    } catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  }

  async getAllEventTypes() {
    try {
      const response = await fetch(this.baseUrl + '/uniqueEvents');
      const eventTypes = Object.values((await response.json()));
      console.log(eventTypes);
      return eventTypes;
    } catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  }

  async getEventsOfType(eventType: String) {
    try {
      // console.log(`eventType: ${eventType}`);
      const response = await fetch(this.baseUrl + `/eventType/${eventType}`);
      const events = (await response.json()).rows;
      // console.log(events);
      return events;
    } catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  }
}
