import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { isValidAccountTokenValue, getTotalTokenUsdValue } from 'helpers';
import { useGetSearch, useGetSort } from 'hooks';
import { accountExtraSelector } from 'redux/selectors';
import { setAccountExtra, getInitialAccountExtraState } from 'redux/slices';
import { TokenTypeEnum, TokenType, SortOrderEnum } from 'types';

import {
  filterTokens,
  sortTokens,
  ProcessedTokenType,
  SortTokenFieldEnum
} from '../helpers';

export const useProcessTokens = (accountTokens: TokenType[]) => {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const { hash: address } = useParams() as any;
  const { accountExtra, isDataReady: isAccountExtraFetched } =
    useSelector(accountExtraSelector);
  const { address: extraAddress } = accountExtra;
  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const { type } = Object.fromEntries(searchParams);

  const validTokenValues = accountTokens.filter((token: TokenType) =>
    isValidAccountTokenValue(token)
  );
  const tokenBalance = getTotalTokenUsdValue(validTokenValues);

  if (!isAccountExtraFetched && address === extraAddress) {
    const accountExtraDetails = getInitialAccountExtraState().accountExtra;
    accountExtraDetails.tokenBalance = tokenBalance;
    dispatch(
      setAccountExtra({
        accountExtra: { ...accountExtraDetails, address },
        isDataReady: true
      })
    );
  }

  const processTokens = ({ tokens }: { tokens: ProcessedTokenType[] }) => {
    const filteredTokens = filterTokens({
      tokens,
      type: type as TokenTypeEnum,
      search
    });

    let currentSort = sort;
    let currentOrder = order;
    if (!(sort && order)) {
      const hasValidValues = filteredTokens.some((token) =>
        isValidAccountTokenValue(token)
      );
      if (!hasValidValues) {
        currentSort = SortTokenFieldEnum.name;
        currentOrder = SortOrderEnum.asc;
      }
    }

    const sortedTokens = sortTokens({
      tokens: filteredTokens,
      field: currentSort as SortTokenFieldEnum,
      order: currentOrder,
      tokenBalance
    });

    return sortedTokens;
  };

  const processedAccountTokens = useMemo(() => {
    const processedSortArray = accountTokens.map((token) => {
      const portofolioPercentage =
        token.valueUsd && tokenBalance
          ? new BigNumber(token.valueUsd).dividedBy(tokenBalance).times(100)
          : new BigNumber(0);
      return { ...token, portofolioPercentage };
    });

    const processedTokens = processTokens({ tokens: processedSortArray });
    return [...processedTokens];
  }, [accountTokens, type, search, sort, order, tokenBalance]);

  return processedAccountTokens;
};
