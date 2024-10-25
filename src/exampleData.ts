import { Flag, Span } from "./types";

export const exampleFlags: Flag[] = [
  {
    "name": "newTestFlag", // must be unique
    "description": "This is an A/B test.", // hypothesis
    "metrics": { // OPTIONAL: metrics we are recording
      "primary": "conversion_rate",
      "secondary": "user_engagement"
    },
    "state": "in_test", // draft | active | in_test | paused | completed | disabled | archived
    "targetingRules": { // OPTIONAL
      "geo": "US"
    },
    "environments": { // the client will receive properties in here
      "testing": {
        "rollout": 100, // percentage of total users that will be included
        "userGroups": {
          "control": {
            "rollout": 50, // percentage of 'outer' rollout
            "trackingEvents": ["clicks", "conversion"], // event data
            "enabled": false, // on/off
            "value": 100 // arbitrary type used to influence effects of the flag
          },
          "treatment": {
            "rollout": 50, // should be complimentary to the 'control'
            "trackingEvents": ["clicks", "conversion"],
            "enabled": true,
            "value": 200
          }
        }
      }
    }
  },
];

export const exampleSpans: Span[] = [
  {
    traceId: 'fef8ed5b3ca3ec1f825c9280ddf5dac6',
    spanId: '6bbdbc68c4b04ee5',
    parentSpanId: '9ebf0afdcd8bb358',
    name: 'middleware - query',
    kind: 1,
    startTimeUnixNano: '1729617381731000000',
    endTimeUnixNano: '1729617381731033810',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/"' },
      { key: 'express.name', type: 'string', value: '"query"' },
      { key: 'express.type', type: 'string', value: '"middleware"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: '2614dfe9d8ef9f0e870630f3a8ff31ee',
    spanId: 'ab7b4e3379d4dda0',
    parentSpanId: '',
    name: 'GET /purchase',
    kind: 2,
    startTimeUnixNano: '1729617384118000000',
    endTimeUnixNano: '1729617384125443967',
    attributes: [
      {
        key: 'http.url',
        type: 'string',
        value: '"http://localhost:8080/purchase"'
      },
      { key: 'http.host', type: 'string', value: '"localhost:8080"' },
      { key: 'net.host.name', type: 'string', value: '"localhost"' },
      { key: 'http.method', type: 'string', value: '"GET"' },
      { key: 'http.scheme', type: 'string', value: '"http"' },
      { key: 'http.target', type: 'string', value: '"/purchase"' },
      {
        key: 'http.user_agent',
        type: 'string',
        value: '"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0"'
      },
      { key: 'http.flavor', type: 'string', value: '"1.1"' },
      { key: 'net.transport', type: 'string', value: '"ip_tcp"' },
      { key: 'net.host.ip', type: 'string', value: '"::ffff:127.0.0.1"' },
      { key: 'net.host.port', type: 'number', value: '"8080"' },
      { key: 'net.peer.ip', type: 'string', value: '"::ffff:127.0.0.1"' },
      { key: 'net.peer.port', type: 'number', value: '"54198"' },
      { key: 'http.status_code', type: 'number', value: '"200"' },
      { key: 'http.status_text', type: 'string', value: '"OK"' },
      { key: 'http.route', type: 'string', value: '"/purchase"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-http', version: '0.53.0' }
  },
  {
    traceId: '1c215328b6d30471e9f62286b38fc1d9',
    spanId: 'e96e1e474378bfda',
    parentSpanId: '1a05c40392476bd6',
    name: 'middleware - expressInit',
    kind: 1,
    startTimeUnixNano: '1729617385324000000',
    endTimeUnixNano: '1729617385324031713',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/"' },
      { key: 'express.name', type: 'string', value: '"expressInit"' },
      { key: 'express.type', type: 'string', value: '"middleware"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: 'bfe9e75d585ebd9f386829bf871af1ce',
    spanId: 'c65b3ba40e87986c',
    parentSpanId: '3972aa0228574c03',
    name: 'request handler - /about',
    kind: 1,
    startTimeUnixNano: '1729617382910000000',
    endTimeUnixNano: '1729617382910005218',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/about"' },
      { key: 'express.name', type: 'string', value: '"/about"' },
      { key: 'express.type', type: 'string', value: '"request_handler"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: '169db2a77995e5a8b3b551b965339f5e',
    spanId: '5cfa18eaee5ec29e',
    parentSpanId: 'fe65f90bbb029fd7',
    name: 'request handler - /purchase',
    kind: 1,
    startTimeUnixNano: '1729617386508000000',
    endTimeUnixNano: '1729617386508004465',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/purchase"' },
      { key: 'express.name', type: 'string', value: '"/purchase"' },
      { key: 'express.type', type: 'string', value: '"request_handler"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: 'd66f4dfd1d744363f524fc7cfd29542a',
    spanId: '821891e99f34e9a1',
    parentSpanId: '5278db7b7a8acd82',
    name: 'middleware - expressInit',
    kind: 1,
    startTimeUnixNano: '1729617387694000000',
    endTimeUnixNano: '1729617387694031711',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/"' },
      { key: 'express.name', type: 'string', value: '"expressInit"' },
      { key: 'express.type', type: 'string', value: '"middleware"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: 'dd1519b5e80e02d9de8aadd7abf4053a',
    spanId: 'cb4b671531f09613',
    parentSpanId: '5e5619c259e9cf1d',
    name: 'middleware - expressInit',
    kind: 1,
    startTimeUnixNano: '1729617388897000000',
    endTimeUnixNano: '1729617388897046895',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/"' },
      { key: 'express.name', type: 'string', value: '"expressInit"' },
      { key: 'express.type', type: 'string', value: '"middleware"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: '6c57948c57683fe8c28909f317108905',
    spanId: 'cc25be33791d6b44',
    parentSpanId: 'e519383fcf7967ea',
    name: 'middleware - query',
    kind: 1,
    startTimeUnixNano: '1729617390103000000',
    endTimeUnixNano: '1729617390103014870',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/"' },
      { key: 'express.name', type: 'string', value: '"query"' },
      { key: 'express.type', type: 'string', value: '"middleware"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
  {
    traceId: '670f0988ffb656308f173c2f8ede6bfc',
    spanId: 'ac22ec850d5d18bc',
    parentSpanId: '239ce7be809e4697',
    name: 'request handler - /about',
    kind: 1,
    startTimeUnixNano: '1729617391358000000',
    endTimeUnixNano: '1729617391358004823',
    attributes: [
      { key: 'http.route', type: 'string', value: '"/about"' },
      { key: 'express.name', type: 'string', value: '"/about"' },
      { key: 'express.type', type: 'string', value: '"request_handler"' }
    ],
    status: {},
    parentScope: { name: '@opentelemetry/instrumentation-express', version: '0.43.0' }
  },
];
