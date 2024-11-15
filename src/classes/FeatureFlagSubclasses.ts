import { FlagValueTypeDef, FlagCurrentValue, FlagValueDef, FlagEnvironmentProps, EnvironmentName, OverrideRuleUnion, FlagEnvironmentMapping } from "@estuary/types";


class FlagValueDefImpl {
  type: FlagValueTypeDef;
  initial: FlagCurrentValue;

  constructor({ type, initial }: FlagValueDef) {
    this.type = type;
    this.initial = initial;
  }
}
export class FlagValueDefTemplate extends FlagValueDefImpl {
  constructor(type: FlagValueTypeDef) {
    let defaults: FlagValueDef = { type: 'boolean' as const, initial: false };
    if (type === 'string') defaults = { type: 'string' as const, initial: '' };
    else if (type === 'number') defaults = { type: 'number' as const, initial: 0 };
    super(defaults);
  }
}
class FlagEnvironmentPropsImpl implements FlagEnvironmentProps {
  name: EnvironmentName;
  enabled: boolean;
  overrideRules: OverrideRuleUnion[];

  constructor(environmentName: EnvironmentName) {
    this.name = environmentName;
    this.enabled = false;
    this.overrideRules = [];
  }

}
class FlagEnvironmentMappingImpl implements FlagEnvironmentMapping {
  prod: FlagEnvironmentProps;
  dev: FlagEnvironmentProps;
  testing: FlagEnvironmentProps;
  staging: FlagEnvironmentProps;

  constructor({ prod, dev, testing, staging }: FlagEnvironmentMapping) {
    this.prod = prod ?? new FlagEnvironmentPropsImpl('prod');
    this.dev = dev ?? new FlagEnvironmentPropsImpl('dev');
    this.testing = testing ?? new FlagEnvironmentPropsImpl('testing');
    this.staging = staging ?? new FlagEnvironmentPropsImpl('staging');
  }
}
export class FlagEnvironmentMappingTemplate extends FlagEnvironmentMappingImpl {
  constructor() {
    const defaults = {
      prod: new FlagEnvironmentPropsImpl('prod'),
      dev: new FlagEnvironmentPropsImpl('dev'),
      testing: new FlagEnvironmentPropsImpl('testing'),
      staging: new FlagEnvironmentPropsImpl('staging'),
    };

    super(defaults);
  }
}
