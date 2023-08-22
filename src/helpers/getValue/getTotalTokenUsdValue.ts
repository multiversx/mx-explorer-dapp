import BigNumber from 'bignumber.js';
import { TokenType } from 'types';

export const getTotalTokenUsdValue = (tokens: TokenType[]) => {
  if (!tokens || tokens.length === 0) {
    return new BigNumber(0).toString();
  }

  const totalUsdValue = tokens.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(new BigNumber(currentValue?.valueUsd ?? 0)),
    new BigNumber(0)
  );

  return totalUsdValue.toString();
};
