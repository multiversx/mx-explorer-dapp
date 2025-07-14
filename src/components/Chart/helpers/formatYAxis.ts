import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { formatAmount, formatBigNumber } from 'helpers';
import { ChartAxisType } from './types';

export const formatYAxis = ({
  tick: tickValue,
  currency,
  percentageMultiplier,
  decimals
}: ChartAxisType) => {
  const bNtick = new BigNumber(tickValue);
  const tick = bNtick.toFixed();

  if (bNtick.isEqualTo(0)) {
    return numeral(tick).format('0');
  }

  if (percentageMultiplier) {
    return `${numeral(Number(tick) * 100).format('0.0')}%`;
  }

  if (decimals) {
    const formattedValue = formatAmount({
      input: new BigNumber(tick).toString(10),
      decimals,
      digits: 2
    });

    return `${numeral(formattedValue).format('0a')}${
      currency ? ` ${currency}` : ''
    }`;
  }

  if (Number(tick) > 1000) {
    if (currency) {
      if (currency === '$') {
        return numeral(tick).format('$0.[00]a');
      }
      return `${numeral(tick).format('0.[00]a')} ${currency}`;
    }

    return numeral(tick).format('0a');
  }

  if (currency) {
    const formatted = formatBigNumber({ value: tick, maxDigits: 4 });
    if (currency === '$') {
      return numeral(formatted).format('$0.[0000]');
    }

    return `${numeral(tick).format('0.[0000]')} ${currency}`;
  }

  return numeral(tick).format('0');
};
