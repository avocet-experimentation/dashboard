import * as stats from 'simple-statistics';

export type NonEmptyArray<T> = [T, ...T[]];
export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0;
export const assertNonEmptyArray = <T>(
  arr: T[],
): asserts arr is NonEmptyArray<T> => {
  if (!isNonEmptyArray(arr)) throw new TypeError(`Array is empty`);
};

export function arithmeticMean(data: [number, ...number[]]): number {
  return data.reduce((sum, curr) => sum + curr, 0) / data.length;
}

/**
 * Statistical inference methods that work on continuous numerical data
 */
export const numberAnalyses: Record<
  string,
  (
    ConditionOneData: NonEmptyArray<number>,
    ConditionTwoData: NonEmptyArray<number>,
  ) => number
> = {
  'Difference of Averages': (
    ConditionOneData: number[],
    ConditionTwoData: number[],
  ) => {
    if (
      !isNonEmptyArray(ConditionOneData) ||
      !isNonEmptyArray(ConditionTwoData)
    ) {
      throw new TypeError(
        'One or more conditions in this hypothesis has no data!',
      );
    } else {
      return (
        arithmeticMean(ConditionOneData) - arithmeticMean(ConditionTwoData)
      );
    }
  },
};

// export const analysisOptions = Object.keys(numberAnalyses).map((key) => ({
//   label: key,
//   value: key,
// }));

// TODO: add ~= operator and conditionally render a box to choose the margin of error
export const operators = ['>', '>=', '=', '<', '<='] as const;
export type Operator = (typeof operators)[number];
export type CompareFn = (x: number, y: number) => boolean;
export const compareFns: Record<Operator, CompareFn> = {
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '=': (x, y) => x === y,
  '<': (x, y) => x < y,
  '<=': (x, y) => x <= y,
};

// export const operatorOptions = operators.map((option) => ({
//   label: option,
//   value: option,
// }));
