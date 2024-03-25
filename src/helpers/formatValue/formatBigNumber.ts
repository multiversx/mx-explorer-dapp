import BigNumber from 'bignumber.js';
import { DIGITS } from 'config';

export const formatBigNumber = (
  number: BigNumber | number | string,
  maxDigits = DIGITS
) => {
  const bN = BigNumber.isBigNumber(number)
    ? number.toFormat()
    : new BigNumber(number).toFormat();

  if (bN.includes('.')) {
    return bN.slice(0, bN.indexOf('.') + (maxDigits ? maxDigits + 1 : 0));
  }

  return bN;
};
