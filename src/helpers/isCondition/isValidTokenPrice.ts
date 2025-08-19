import BigNumber from 'bignumber.js';

import { LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD } from 'appConstants';
import { TokenType } from 'types';

export const isValidTokenPrice = ({
  price,
  marketCap,
  isLowLiquidity
}: TokenType) => {
  return Boolean(
    price &&
      marketCap &&
      (!isLowLiquidity ||
        new BigNumber(marketCap).isLessThan(
          LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
        ))
  );
};
