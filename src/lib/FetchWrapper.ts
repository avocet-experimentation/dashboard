type SafeOmit<T, Keys extends keyof T> = {
  [P in keyof T as P extends Keys ? never : P]: T[P];
};

/**
 * Options to configure requests, excluding headers and body.
 * See https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
 */
type RequestOptions = SafeOmit<RequestInit, "headers" | "body" | "signal">;

export type FailedResponse = Omit<Response, 'ok'> & { ok: false };

export type ParsedResponse<T> = Omit<Response, 'body'> & {
  ok: true;
  body: T;
};

export type ResponseTypes<T> = FailedResponse | ParsedResponse<T>;

type BodyEncoder = (body: unknown) => BodyInit | null;

type ResponseHandler = <T>(response: Response) => Promise<FailedResponse | ParsedResponse<T>>;

const defaultJsonHeaders = {
  "content-type": "application/json",
};

function encodeToJson(body?: unknown) {
  if (!body) return null;
  return JSON.stringify(body);
}

async function handleJsonResponse<T>(
  response: Response
): Promise<ResponseTypes<T>> {
  if (!response.ok) {
    return { ...response, ok: false };
  } else {
    const parsed: T = await response.json();
    return { ...response, ok: true, body: parsed };
  }
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
  handleResponse: ResponseHandler;
  bodyEncoder: BodyEncoder;

  constructor(
    // the socket to make requests to
    baseURL: string,
    // headers to include in all requests
    defaultHeaders: HeadersInit = defaultJsonHeaders,
    defaultRequestOptions: RequestOptions = {
      credentials: "include",
    },
    responseHandler: ResponseHandler = handleJsonResponse,
    bodyEncoder: BodyEncoder = encodeToJson
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.defaultRequestOptions = defaultRequestOptions;
    this.handleResponse = responseHandler;
    this.bodyEncoder = bodyEncoder;
  }

  // #region FUNCTIONS FOR VARIOUS HTTP METHODS
  async get(path: string, headers: HeadersInit = this.defaultHeaders) {
    return this.#send("GET", path, undefined, headers);
  }

  put(
    path: string,
    body?: unknown,
    headers: HeadersInit = this.defaultHeaders
  ) {
    return this.#send("PUT", path, body, headers);
  }

  post(
    path: string,
    body?: unknown,
    headers: HeadersInit = this.defaultHeaders
  ) {
    return this.#send("POST", path, body, headers);
  }

  patch(
    path: string,
    body?: unknown,
    headers: HeadersInit = this.defaultHeaders
  ) {
    return this.#send("PATCH", path, body, headers);
  }

  delete(
    path: string,
    body?: unknown,
    headers: HeadersInit = this.defaultHeaders
  ) {
    return this.#send("DELETE", path, body, headers);
  }
  // #endregion

  async #send(
    method: string,
    path: string,
    body?: unknown,
    headers?: HeadersInit
  ) {

    const requestOptions = this.#buildRequestOptions(method, body, headers);
    try {
      const response = await fetch(this.baseURL + path, requestOptions);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof Response) {
        return this.handleResponse(error);
      } else { // this block shouldn't be reachable
        console.error(error);
        throw new TypeError(`Error ${JSON.stringify(error)} not recognized!`);
      }
    }
  }

  #buildRequestOptions(
    method: string,
    body?: unknown,
    headers?: HeadersInit
  ) {
    const options: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
    };

    Object.assign(options, { body: this.bodyEncoder(body) });

    return options;
  }
}
