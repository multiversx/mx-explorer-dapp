import BigNumber from 'bignumber.js';
import { ELLIPSIS } from 'appConstants';
import { DECIMALS } from 'config';

export function parseAmount(amount: BigNumber.Value, numDecimals?: number) {
  const amountAsBigInteger = new BigNumber(amount);
  if (!amountAsBigInteger.isInteger() || amountAsBigInteger.isNegative()) {
    return ELLIPSIS;
  }

  return amountAsBigInteger
    .shiftedBy(numDecimals !== undefined ? numDecimals : DECIMALS)
    .decimalPlaces(0)
    .toFixed(0);
}
