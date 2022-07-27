import BigNumber from 'bignumber.js';
const validDisplayValue = (value: string | number, decimals?: number) => {
  if (!value || value === '...') {
    return '...';
  }
  return new BigNumber(value).toFormat(decimals);
};

export default validDisplayValue;
