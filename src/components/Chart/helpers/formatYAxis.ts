import { formatAmount } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { ChartAxisType } from './types';

export const formatYAxis = ({
  tick,
  currency,
  percentageMultiplier,
  decimals
}: ChartAxisType) => {
  if (percentageMultiplier) {
    return `${numeral(Number(tick) * 100).format('0.0')}%`;
  } else if (decimals) {
    const denominatedValue = formatAmount({
      input: new BigNumber(tick).toString(10),
      decimals,
      digits: 2,
      showLastNonZeroDecimal: false,
      addCommas: false
    });

    return `${numeral(denominatedValue).format('0a')}${
      currency ? ` ${currency}` : ''
    }`;
  } else if (currency) {
    if (currency === '$') {
      return numeral(tick).format('$0a');
    }

    return `${numeral(tick).format('0a')} ${currency}`;
  } else if (Number(tick) > 1000) {
    if (currency) {
      if (currency === '$') {
        return numeral(tick).format('$0.0a');
      }
      return `${numeral(tick).format('0.0a')} ${currency}`;
    }

    return numeral(tick).format('0a');
  }

  return numeral(tick).format('0');
};
