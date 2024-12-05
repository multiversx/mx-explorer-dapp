import BigNumber from 'bignumber.js';

import { ELLIPSIS } from 'appConstants';

export interface GetStringPluralOptionsType {
  string?: string;
  plural?: string;
}

export const getStringPlural = (
  value: string | number | BigNumber,
  options?: GetStringPluralOptionsType
) => {
  if (value === ELLIPSIS) {
    return `${options?.string}${options?.plural ?? 's'}`;
  }
  const formattedValue = String(value).replace(/[^\d.-]/g, '');
  const bNValue = BigNumber.isBigNumber(value)
    ? value
    : new BigNumber(formattedValue);

  if (bNValue.isGreaterThan(1) || bNValue.isZero()) {
    return `${options?.string}${options?.plural ?? 's'}`;
  }
  return `${options?.string}`;
};
