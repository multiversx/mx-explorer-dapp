import BigNumber from 'bignumber.js';

import { LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import { TokenType } from 'types';

export const isValidAccountTokenValue = (token: TokenType) => {
  return Boolean(
    token.valueUsd &&
      (!token.isLowLiquidity ||
        new BigNumber(token.valueUsd).isLessThan(
          LOW_LIQUIDITY_DISPLAY_TRESHOLD
        ))
  );
};
