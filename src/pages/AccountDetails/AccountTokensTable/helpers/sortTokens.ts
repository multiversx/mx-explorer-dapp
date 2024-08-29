import BigNumber from 'bignumber.js';

import { LOW_LIQUIDITY_DISPLAY_TRESHOLD } from 'appConstants';
import { formatAmount } from 'helpers';
import { TokenType, SortOrderEnum } from 'types';

export enum SortTokenFieldEnum {
  name = 'name',
  balance = 'balance',
  price = 'price',
  value = 'value',
  portofolioPercent = 'portofolioPercent'
}

export interface ProcessedTokenType extends TokenType {
  portofolioPercentage: BigNumber;
}

export interface SortTokensType {
  field?: SortTokenFieldEnum;
  order?: SortOrderEnum;
  tokens: ProcessedTokenType[];
  tokenBalance?: string;
}

const getTokenDisplayValue = ({
  valueUsd,
  isLowLiquidity
}: ProcessedTokenType) => {
  if (
    valueUsd &&
    (!isLowLiquidity ||
      new BigNumber(valueUsd).isLessThan(LOW_LIQUIDITY_DISPLAY_TRESHOLD))
  ) {
    return new BigNumber(valueUsd);
  }

  return new BigNumber(0);
};

const getPortofolioPercent = ({
  token,
  tokenBalance
}: {
  token: ProcessedTokenType;
  tokenBalance: string;
}) => {
  return token.valueUsd && tokenBalance
    ? new BigNumber(token.valueUsd).dividedBy(tokenBalance).times(100)
    : new BigNumber(0);
};

export const sortTokens = ({
  field = SortTokenFieldEnum.value,
  order = SortOrderEnum.desc,
  tokens = [],
  tokenBalance
}: SortTokensType) => {
  if (field && order) {
    const sortParams = order === SortOrderEnum.asc ? [1, -1] : [-1, 1];

    switch (true) {
      case field === SortTokenFieldEnum.name:
        tokens.sort((a, b) => {
          const aName = a.assets?.name ?? a.name;
          const bName = b.assets?.name ?? b.name;
          return aName.toLowerCase() > bName.toLowerCase()
            ? sortParams[0]
            : sortParams[1];
        });
        break;

      case field === SortTokenFieldEnum.value:
        tokens.sort((a, b) => {
          const aValue = getTokenDisplayValue(a);
          const bValue = getTokenDisplayValue(b);
          return aValue.isGreaterThan(bValue) ? sortParams[0] : sortParams[1];
        });
        break;

      case field === SortTokenFieldEnum.balance:
        tokens.sort((a, b) => {
          const aBalance = formatAmount({
            input: new BigNumber(a.balance ?? 0).toString(10),
            decimals: a.decimals,
            showLastNonZeroDecimal: true
          });
          const bBalance = formatAmount({
            input: new BigNumber(b.balance ?? 0).toString(10),
            decimals: b.decimals,
            showLastNonZeroDecimal: true
          });
          return new BigNumber(aBalance).isGreaterThan(bBalance)
            ? sortParams[0]
            : sortParams[1];
        });
        break;

      case field === SortTokenFieldEnum.portofolioPercent:
        if (!tokenBalance) {
          return tokens;
        }

        tokens.sort((a, b) => {
          const aPercent = getPortofolioPercent({ token: a, tokenBalance });
          const bPercent = getPortofolioPercent({ token: b, tokenBalance });
          return new BigNumber(aPercent).isGreaterThan(bPercent)
            ? sortParams[0]
            : sortParams[1];
        });
        break;

      case field === SortTokenFieldEnum.price:
        tokens.sort((a, b) => {
          return new BigNumber(a.price ?? 0).isGreaterThan(b.price ?? 0)
            ? sortParams[0]
            : sortParams[1];
        });
        break;

      default:
        return tokens;
        break;
    }
  }

  return tokens;
};
