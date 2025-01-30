import BigNumber from 'bignumber.js';

import { DIGITS } from 'config';
import { stringIsFloat } from 'helpers';

export const amountWithoutRounding = (
  amount: string | number | BigNumber,
  minNonZeroDigits?: number,
  maxDigits?: number
) => {
  const bNamount = BigNumber.isBigNumber(amount)
    ? amount
    : new BigNumber(amount);

  const formattedAmount = bNamount.toFormat({
    groupSeparator: '',
    decimalSeparator: '.'
  });
  if (stringIsFloat(formattedAmount)) {
    if (bNamount.isZero()) {
      return '0';
    }

    const amountDigits = formattedAmount.split('.')?.[1];
    let displayDigits = minNonZeroDigits ?? DIGITS;
    if (amountDigits) {
      for (let i = 0; i < amountDigits.length; i++) {
        if (amountDigits.charAt(i) === '0') {
          displayDigits++;
        } else {
          break;
        }
      }
    }

    return new BigNumber(amount).toFormat(maxDigits ?? displayDigits);
  }

  return '0';
};
