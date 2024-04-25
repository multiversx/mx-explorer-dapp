import BigNumber from 'bignumber.js';

export interface GetStringPluralOptionsType {
  string?: string;
  plural?: string;
}

export const getStringPlural = (
  value: string | number | BigNumber,
  options?: GetStringPluralOptionsType
) => {
  const bNValue = BigNumber.isBigNumber(value) ? value : new BigNumber(value);

  if (bNValue.isGreaterThan(1) || bNValue.isZero()) {
    return `${options?.string}${options?.plural ?? 's'}`;
  }
  return `${options?.string}`;
};
