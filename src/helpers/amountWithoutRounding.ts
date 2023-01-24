import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';
import { stringIsFloat } from './stringIsFloat';

export const amountWithoutRounding = (
  amount: string,
  minNonZeroDecimals?: number,
  maxDecimals?: number
) => {
  if (stringIsFloat(amount)) {
    const bNamount = new BigNumber(amount);

    if (bNamount.isZero()) {
      return '0';
    }

    const amountDecimals = amount.split('.')?.[1];
    let displayDecimals = minNonZeroDecimals ?? DIGITS;
    if (amountDecimals) {
      for (let i = 0; i < amountDecimals.length; i++) {
        if (amountDecimals.charAt(i) === '0') {
          displayDecimals++;
        } else {
          break;
        }
      }
    }

    return new BigNumber(amount).toFormat(maxDecimals ?? displayDecimals);
  }

  return '0';
};
