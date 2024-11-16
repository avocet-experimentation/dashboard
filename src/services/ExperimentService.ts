import FetchWrapper from "#/lib/FetchWrapper";
import { ExperimentDraft } from "@estuary/types";

const BASE_URL = import.meta.env.VITE_FLAG_SERVICE_URL + "/experiments";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  mode: "cors",
};

const DEFAULT_REQUEST_OPTIONS = {};

export default class ExperimentService {
  #fetch: FetchWrapper;

  constructor() {
    this.#fetch = new FetchWrapper(
      BASE_URL,
      DEFAULT_HEADERS,
      DEFAULT_REQUEST_OPTIONS
    );
  }

  async createExperiment(
    experimentContent: ExperimentDraft
  ): Promise<Response> {
    const response = await this.#fetch.post("", experimentContent);
    return response;
  }
}
