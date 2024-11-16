type SafeOmit<T, Keys extends keyof T> = {
  [P in keyof T as P extends Keys ? never : P]: T[P];
};

type RequestOptions = SafeOmit<RequestInit, "headers" | "body" | "signal">;

const defaultJsonHeaders = {
  "content-type": "application/json",
};

function encodeToJson(body?: BodyInit | null) {
  if (!body) return null;
  return JSON.stringify(body);
}

async function handleJsonResponse<T>(
  response: Response
): Promise<T | undefined> {
  if (!response) {
    throw new Error(`No response received`);
  } else if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`);
  } else return (await response.json()) as Promise<T>;
}

/**
 * Streamlines fetch syntax by creating an object that makes requests to a given address.
 * Allows headers and other request options to be specified in advance.
 * By default, assumes request and response bodies are sent as JSON, and handles parsing automatically.
 */
export default class FetchWrapper {
  baseURL: string;
  defaultRequestOptions: RequestOptions;
  defaultHeaders: HeadersInit;
  handleResponse: (response: Response) => unknown;

  constructor(
    // the socket to make requests to
    baseURL: string,
    // headers to include in all requests
    defaultHeaders: HeadersInit = defaultJsonHeaders,
    // options to configure requests, excluding headers and body. See https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
    defaultRequestOptions: RequestOptions = {
      credentials: "include",
    },
    // logic for handling
    responseHandler: (response: Response) => unknown = handleJsonResponse
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.defaultRequestOptions = defaultRequestOptions;
    this.handleResponse = responseHandler;
  }

  async get(path: string, headers: HeadersInit = this.defaultHeaders) {
    return this.#send("GET", path, undefined, headers);
    // const requestOptions: RequestInit = {
    //   method: 'GET',
    //   headers: {...this.defaultHeaders, ...headers},
    // }

    // try {
    //   const response = await fetch(this.baseURL + path, requestOptions);
    //   return this.handleResponse(response);
    //   } catch(error) {
    //     console.error(error);
    //     return;
    // }
  }

  put(
    path: string,
    body?: BodyInit | null,
    headers: HeadersInit = this.defaultHeaders
  ) {
    // const fetchHeaders = {...this.defaultHeaders, ...headers};
    return this.#send("PUT", path, body, headers);
  }

  post(
    path: string,
    body?: BodyInit | null,
    headers: HeadersInit = this.defaultHeaders
  ) {
    // const fetchHeaders = {...this.defaultHeaders, ...headers};
    return this.#send("POST", path, body, headers);
  }

  patch(
    path: string,
    body?: BodyInit | null,
    headers: HeadersInit = this.defaultHeaders
  ) {
    // const fetchHeaders = {...this.defaultHeaders, ...headers};
    return this.#send("PATCH", path, body, headers);
  }

  delete(
    path: string,
    body?: BodyInit | null,
    headers: HeadersInit = this.defaultHeaders
  ) {
    // const fetchHeaders = {...this.defaultHeaders, ...headers};
    return this.#send("DELETE", path, body, headers);
  }

  async #send(
    method: string,
    path: string,
    body?: BodyInit | null,
    headers?: HeadersInit
  ) {
    // const fetchHeaders = {...this.defaultHeaders, ...headers};

    const requestOptions = this.#buildRequestOptions(method, body, headers);
    try {
      const response = await fetch(this.baseURL + path, requestOptions);
      return this.handleResponse(response);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  #buildRequestOptions(
    method: string,
    body?: BodyInit | null,
    headers?: HeadersInit
  ) {
    const options: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
    };

    if (body) Object.assign(options, { body: encodeToJson(body) });

    return options;
  }
}
