import numeral from 'numeral';
import { CurrencyEnum } from './types';

const formatYAxis = (tickItem: string, currency?: CurrencyEnum) => {
  if (Number(tickItem) > 1000) {
    if (currency) {
      return numeral(tickItem).format('$0.0a');
    }

    return numeral(tickItem).format('0.0a');
  } else if (currency) {
    return numeral(tickItem).format('$0a');
  }

  return numeral(tickItem).format('0');
};

export default formatYAxis;
