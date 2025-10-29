import BigNumber from 'bignumber.js';

import {
  LOW_LIQUIDITY_DISPLAY_TRESHOLD,
  LOW_LIQUIDITY_MIN_LIQUIDITY_THRESHHOLD
} from 'appConstants';
import { TokenType } from 'types';

export const isValidAccountTokenValue = (token?: TokenType) => {
  if (!token?.valueUsd) {
    return true;
  }

  const hasValidLowLiquidityDisplayValue =
    token.isLowLiquidity &&
    new BigNumber(token.valueUsd).isLessThan(LOW_LIQUIDITY_DISPLAY_TRESHOLD) &&
    new BigNumber(token.totalLiquidity ?? 0).isGreaterThan(
      LOW_LIQUIDITY_MIN_LIQUIDITY_THRESHHOLD
    );

  return Boolean(!token.isLowLiquidity || hasValidLowLiquidityDisplayValue);
};
