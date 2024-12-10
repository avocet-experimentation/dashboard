import { ResponseTypes } from '#/lib/fetchTypes';
import FetchWrapper from '#/lib/FetchWrapper';
import { timeElapsed } from '#/lib/timeFunctions';
import { TransformedSpan } from '@estuary/types';

export default class TelemetryService {
  fetch: FetchWrapper;

  constructor() {
    const DEFAULT_HEADERS = {
      'Content-Type': 'application/json',
      mode: 'cors',
    };

    const DEFAULT_REQUEST_OPTIONS = {};

    this.fetch = new FetchWrapper(
      import.meta.env.VITE_EVENT_SERVICE_URL,
      DEFAULT_HEADERS,
      DEFAULT_REQUEST_OPTIONS,
    );
  }

  async getMany(): Promise<ResponseTypes<TransformedSpan[]>> {
    const startTime = Date.now();
    try {
      const response = await this.fetch.get<TransformedSpan[]>('/spans');

      console.log(`Fetch request fulfilled in ${timeElapsed(startTime)} sec`);
      console.log({ response });
      if (!response.ok) {
        return response;
      }

      return {
        ...response,
        body: response.body as TransformedSpan[],
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
      throw new Error('Fetch response threw an unhandled exception!');
    }
  }

  async getAllSpanTypes(): Promise<ResponseTypes<string[]>> {
    const startTime = Date.now();
    try {
      const response = await this.fetch.get('/uniqueAttributes');
      console.log(`Fetch request fulfilled in ${timeElapsed(startTime)} sec`);
      console.log({ response });
      if (!response.ok) {
        return response;
      }
      return {
        ...response,
        body: response.body as string[],
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
      throw new Error('Fetch response threw an unhandled exception!');
    }
  }

  async getSpansOfType(
    spanType: string,
  ): Promise<ResponseTypes<TransformedSpan[]>> {
    if (spanType === null) {
      throw new TypeError('Passed spanType cannot be null!');
    }

    const startTime = Date.now();
    try {
      // if (spanType === null) {
      //   const response = await this.getMany();
      //   console.log({ response });
      //   return response;
      // } else {
      console.log({ spanType });
      const response = await this.fetch.get(`/spanType/${spanType}`);
      console.log(`Fetch request fulfilled in ${timeElapsed(startTime)} sec`);
      console.log({ response });
      if (!response.ok) {
        return response;
      }

      return {
        ...response,
        body: response.body as TransformedSpan[],
      };
      // }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
      throw new Error('Fetch response threw an unhandled exception!');
    }
  }
}
