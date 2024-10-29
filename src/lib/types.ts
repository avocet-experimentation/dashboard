// export interface Flag {
//   name: string,
//   description: string,
// }

export interface FeatureFlag {
  name: string;
  description: string;
  metrics: {
    primary: string;
    secondary: string;
  };
  state: "in_test" | "completed" | "archived";
  targetingRules: {
    geo?: string[];
  };
  environments: {
    testing: {
      rollout: number;
      userGroups: {
        control: {
          rollout: number;
          trackingEvents: string[];
          enabled: boolean;
          value: number;
        };
        treatment: {
          rollout: number;
          trackingEvents: string[];
          enabled: boolean;
          value: number;
        };
      };
    };
  };
}

export interface Event {
  traceId: string,
  spanId: string,
  name: string,
}

interface Scope {
  name: string;
  version: string;
}

// context for a span, such as the route followed, current configuration, etc
// possible candidate for storing flag/experiment statuses as well
interface SpanStringAttribute {
  key: string; // e.g., http.route
  value: {
    stringValue: string; // e.g., '/'
  }
}

interface SpanIntAttribute {
  key: string; // e.g., http.route
  value: {
	intValue: string; // e.g., '/'
  }
}

type SpanPrimitiveAttribute = SpanStringAttribute | SpanIntAttribute;

// SpanArrayAttribute is adistributive conditional type. See https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type ToArray<T> = T extends any ? T[] : never;
type SpanArrayAttribute = ToArray<SpanPrimitiveAttribute>;

interface SpanAttribute {
  key: string;
  type: string;
  value: string | string[];
}

// "span" is a catch-all term for units of work or operations. See [Observability primer | OpenTelemetry](https://opentelemetry.io/docs/concepts/observability-primer/)
export interface Span {
  traceId: string; // uniquely identifies the path taken by a request through various system components
  spanId: string;
  parentSpanId: string; // seems spans can be nested
  name: string;
  kind: number;
  startTimeUnixNano: string; // Unix timestamp?
  endTimeUnixNano: string;
  attributes: SpanAttribute[];
  status: object;
  parentScope: Scope;
}

interface ScopeSpan {
  scope: Scope;
  spans: Span[];
}

interface ResourceSpan {
  resource: {
    attributes: SpanAttribute[];
  };
  scopeSpans: ScopeSpan[];
}