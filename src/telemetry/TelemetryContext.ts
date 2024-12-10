import TelemetryService from '#/services/TelemetryService';
import {
  CoercedSpanAttributes,
  TextPrimitive,
  TransformedSpan,
  TransformedSpanAttributes,
} from '@estuary/types';
import { createContext } from 'react';

interface TelemetryContextValue {
  spans: TransformedSpan[];
  setSpans: React.Dispatch<React.SetStateAction<TransformedSpan[]>>;
  selectedType: string | null;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  telemetryService: TelemetryService;
  getAllTelemetry: () => Promise<void>;
  fetchSpansOfType: (type: string) => Promise<void>;
  parseAttributesToMap: (
    spanAttributes: TransformedSpanAttributes,
  ) => CoercedSpanAttributes;
  parseAttributesToEntries: (
    spanAttributes: TransformedSpanAttributes,
  ) => [string, TextPrimitive][];
}

export const TelemetryContext = createContext<TelemetryContextValue>({
  spans: [],
  setSpans: () => {},
  selectedType: null,
  setSelectedType: () => {},
  isLoading: false,
  setIsLoading: () => {},
  telemetryService: new TelemetryService(),
  getAllTelemetry: async () => {},
  fetchSpansOfType: async (type: string) => {},
  parseAttributesToMap: (spanAttributes: TransformedSpanAttributes) => ({}),
  parseAttributesToEntries: (spanAttributes: TransformedSpanAttributes) => [],
});
