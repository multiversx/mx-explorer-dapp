import BigNumber from 'bignumber.js';

import { LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import { TokenType } from 'types';

export const isValidAccountTokenValue = (token?: TokenType) => {
  if (!token) {
    return true;
  }

  const hasValidDisplayValue =
    token.valueUsd &&
    token.isLowLiquidity === undefined &&
    new BigNumber(token.valueUsd).isLessThan(LOW_LIQUIDITY_DISPLAY_TRESHOLD);

  return Boolean(
    (token.valueUsd && token.isLowLiquidity === false) || hasValidDisplayValue
  );
};
