import BigNumber from 'bignumber.js';

import { ELLIPSIS, ZERO } from 'appConstants';
import { DIGITS } from 'config';
import { stringIsFloat } from 'helpers';

export interface FormatBigNumberType {
  value: string | number | BigNumber | undefined | typeof ELLIPSIS;
  digits?: number;
  maxDigits?: number;
}

export const formatBigNumber = ({
  value,
  digits = DIGITS,
  maxDigits
}: FormatBigNumberType) => {
  if (value === ELLIPSIS || value === undefined) {
    return ELLIPSIS;
  }
  const bNvalue = BigNumber.isBigNumber(value)
    ? value
    : new BigNumber(String(value).replace(/[^\d.-]/g, ''));

  const formattedAmount = bNvalue.toFormat({
    groupSeparator: '',
    decimalSeparator: '.'
  });
  if (!stringIsFloat(formattedAmount)) {
    return ELLIPSIS;
  }
  if (bNvalue.isZero()) {
    return ZERO;
  }

  const amountDigits = formattedAmount.split('.')?.[1];
  if (amountDigits && digits) {
    for (let i = 0; i < amountDigits.length; i++) {
      if (amountDigits.charAt(i) === ZERO) {
        digits++;
      } else {
        break;
      }
    }
  }

  const displayDigits = maxDigits ?? digits;
  const bN = bNvalue.toFormat();
  if (bN.includes('.')) {
    return bN.slice(
      0,
      bN.indexOf('.') + (displayDigits ? displayDigits + 1 : 0)
    );
  }

  return bN;
};
