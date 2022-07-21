import BigNumber from 'bignumber.js';
import { decimals as configDecimals } from 'appConfig';
import stringIsFloat from './stringIsFloat';

const amountWithoutRounding = (amount: string, decimals?: number) => {
  if (stringIsFloat(amount)) {
    const decimalsToUse = decimals ?? configDecimals;
    const bNamount = new BigNumber(amount);

    if (bNamount.isZero()) {
      return '0';
    }

    let formattedAmount = new BigNumber(amount).toFormat(decimalsToUse);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(decimalsToUse + 4);

    return parseFloat(formattedAmount) > 0
      ? formattedAmount
      : new BigNumber(amount).toFormat(decimalsToUse + 9);
  }

  return '0';
};

export default amountWithoutRounding;
