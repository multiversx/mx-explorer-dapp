import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetSearch, useGetSort } from 'hooks';
import { accountExtraSelector } from 'redux/selectors';
import { TokenTypeEnum, TokenType } from 'types';

import {
  filterTokens,
  sortTokens,
  ProcessedTokenType,
  SortTokenFieldEnum
} from '../helpers';

export const useProcessTokens = (accountTokens: TokenType[]) => {
  const { hash: address } = useParams() as any;

  const [searchParams] = useSearchParams();
  const { accountExtra } = useSelector(accountExtraSelector);

  const { tokenBalance, address: extraAddress } = accountExtra;

  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const { type } = Object.fromEntries(searchParams);

  const processTokens = ({ tokens }: { tokens: ProcessedTokenType[] }) => {
    const filteredTokens = filterTokens({
      tokens,
      type: type as TokenTypeEnum,
      search
    });

    const sortedTokens = sortTokens({
      tokens: filteredTokens,
      field: sort as SortTokenFieldEnum,
      order,
      tokenBalance
    });

    return sortedTokens;
  };

  const processedAccountTokens = useMemo(() => {
    const processedSortArray = accountTokens.map((token) => {
      const portofolioPercentage =
        token.valueUsd && tokenBalance && address === extraAddress
          ? new BigNumber(token.valueUsd).dividedBy(tokenBalance).times(100)
          : new BigNumber(0);
      return { ...token, portofolioPercentage };
    });

    const processedTokens = processTokens({ tokens: processedSortArray });
    return [...processedTokens];
  }, [accountTokens, type, search, sort, order, tokenBalance]);

  return processedAccountTokens;
};
