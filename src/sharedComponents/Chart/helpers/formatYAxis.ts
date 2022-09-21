import numeral from 'numeral';

const formatYAxis = (tickItem: string, currency?: string) => {
  if (Number(tickItem) > 1000) {
    if (currency) {
      if (currency === '$') {
        return numeral(tickItem).format('$0.0a');
      }
      return `${numeral(tickItem).format('0.0a')} ${currency}`;
    }

    return numeral(tickItem).format('0.0a');
  } else if (currency) {
    if (currency === '$') {
      return numeral(tickItem).format('$0a');
    }

    return `${numeral(tickItem).format('0a')} ${currency}`;
  }

  return numeral(tickItem).format('0');
};

export default formatYAxis;
