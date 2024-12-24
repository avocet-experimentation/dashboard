/*
	- [ ] Filters we want on the dashboard:
		- [X] spans containing any flag data
		- [X] spans containing a given flag name
		- [ ] spans containing a given experiment (get the hash using `expIdHash` of all blocks for that experiment and query for matches)
		- [ ] spans containing a given experiment group (same, but just blocks in the group)
	- [ ] getting field data from filtered spans:
		- [X] get all values for a given field on span attributes
			- [ ] in dashboard, allow users to provide a field name and its data type (eg., `"<appname>.order.subtotal"`, `number`) to define the dependent variable on an experiment
- [ ] Aggregations on span types
	- [ ] total count of data per experiment group | just use length after getting exp group?
	- [ ] sum of some user-chosen property per experiment group | length on exp group -> get all vals
*/

import * as hashLib from './hash';
import {
  ClientPropMapping,
  ExperimentGroup,
  Treatment,
  Experiment,
} from '@avocet/core';

const flagVariantRegex = /avocet\.\S{3,}\.variant/;
const flagHashRegex = /avocet\.\S{3,}\.hash/;

const spansWithFlags = (spans) => {
  return spans.filter((span) => {
    const keys = Object.keys(span.spanattributes);
    let hasFlag = false;
    keys.forEach((key) => {
      if (key.match(flagVariantRegex)) {
        hasFlag = true;
      }
    });

    return hasFlag;
  }); // if spans exists, return true
};

const spansWithFlagName = (spans, flagName: String) => {
  return spans.filter((span) => {
    return `estuary-exp.${flagName}.variant` in span.spanattributes;
  });
};

const spansForExperiment = (
  spans,
  experiment: Experiment,
  group: ExperimentGroup,
  treatment: Treatment,
) => {
  const targetHash = `"${hashLib.getExpHash(experiment, group, treatment)}"`; // '"1495033474"'
  return spans.filter((span) => {
    let match = false;
    Object.keys(span.spanattributes).forEach((key) => {
      console.log(span.spanattributes[key]);
      if (span.spanattributes[key] === targetHash) {
        match = true;
      }
    });

    return match;
  });
};

/*
    const expHashes = Object.keys(span.spanattributes)
      .filter(attr => attr.match(flagHashRegex));
    */

// get an array of the value of a given spanattributes property for each span
const getPropertyValueArray = (spans, property) => {
  return spans.map((span) => span.spanattributes[property]);
};

export {
  spansWithFlags,
  spansWithFlagName,
  spansForExperiment,
  getPropertyValueArray,
};
