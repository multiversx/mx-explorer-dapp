import numeral from 'numeral';
import BigNumber from 'bignumber.js';
import { ChartAxisType } from './types';
import { denominate } from 'components/Denominate/denominate';

export const formatYAxis = ({
  tick,
  currency,
  percentageMultiplier,
  denomination,
}: ChartAxisType) => {
  if (percentageMultiplier) {
    return `${numeral(Number(tick) * 100).format('0.0')}%`;
  } else if (denomination) {
    const denominatedValue = denominate({
      input: new BigNumber(tick).toString(10),
      denomination,
      decimals: 2,
      showLastNonZeroDecimal: false,
      addCommas: false,
    });

    return `${numeral(denominatedValue).format('0a')}${currency ? ` ${currency}` : ''}`;
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
