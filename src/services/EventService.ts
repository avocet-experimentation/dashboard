export default class EventService {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_EVENT_SERVICE_URL;
  }

  async getAllEvents() {
    try {
      const response = await fetch(this.baseUrl + '/events');
      const allEvents = (await response.json())._rs.rows;
      console.log({allEvents})
      return allEvents;
    } catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  }
}
