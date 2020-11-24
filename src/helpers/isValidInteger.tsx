import BigNumber from 'bignumber.js';

const isValidInteger = (integer: string) => {
  if (integer.includes('.')) {
    return false;
  }

  const bNparsed = new BigNumber(integer);
  return bNparsed.toString(10) === integer && bNparsed.comparedTo(0) >= 0;
};

export default isValidInteger;
