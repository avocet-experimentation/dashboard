import TelemetryService from '#/services/TelemetryService';
import {
  TransformedSpan,
  TransformedSpanAttributes,
  CoercedSpanAttributes,
  TextPrimitive,
  PrimitiveTypeLabel,
} from '@estuary/types';
import { useState } from 'react';
import { TelemetryContext } from './TelemetryContext';

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [spans, setSpans] = useState<TransformedSpan[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const telemetryService = new TelemetryService();

  const getAllTelemetry = async () => {
    const response = await telemetryService.getMany();
    if (response.ok) {
      setSpans(response.body);
    }
  };

  const fetchSpansOfType = async (type: string) => {
    const response = await telemetryService.getSpansOfType(type);
    if (response.ok) {
      setSpans(response.body);
    }
  };

  /**
   * Coerces all attribute values to the specified type and returns a flat object
   */
  const parseAttributesToMap = (spanAttributes: TransformedSpanAttributes) => {
    return Object.entries(spanAttributes).reduce(
      (acc: CoercedSpanAttributes, [key, { type, value }]) =>
        Object.assign(acc, { [key]: coerceValue(value, type) }),
      {},
    );
  };

  /**
   * Coerces all attribute values to the specified type and returns an array of entries
   */
  const parseAttributesToEntries = (
    spanAttributes: TransformedSpanAttributes,
  ): [string, TextPrimitive][] => {
    return Object.entries(spanAttributes).map(([key, { type, value }]) => [
      key,
      coerceValue(value, type),
    ]);
  };

  const coerceValue = (value: string, type: PrimitiveTypeLabel) => {
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
    }
  };

  const value = {
    spans,
    setSpans,
    selectedType,
    setSelectedType,
    isLoading,
    setIsLoading,
    telemetryService,
    getAllTelemetry,
    fetchSpansOfType,
    parseAttributesToMap,
    parseAttributesToEntries,
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}
