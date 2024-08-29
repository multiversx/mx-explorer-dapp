import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { isValidTokenValue, getTotalTokenUsdValue } from 'helpers';
import { useGetSearch, useGetSort } from 'hooks';
import { accountExtraSelector } from 'redux/selectors';
import { setAccountExtra, getInitialAccountExtraState } from 'redux/slices';
import { TokenTypeEnum, TokenType } from 'types';

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
  const { accountExtra, isFetched: isAccountExtraFetched } =
    useSelector(accountExtraSelector);

  const { tokenBalance, address: extraAddress } = accountExtra;

  const { search } = useGetSearch();
  const { sort, order } = useGetSort();
  const { type } = Object.fromEntries(searchParams);

  if (!isAccountExtraFetched) {
    const validTokenValues = accountTokens.filter((token: TokenType) =>
      isValidTokenValue(token)
    );
    const tokenBalance = getTotalTokenUsdValue(validTokenValues);
    const accountExtraDetails = getInitialAccountExtraState().accountExtra;
    accountExtraDetails.tokenBalance = tokenBalance;
    dispatch(
      setAccountExtra({
        accountExtra: { ...accountExtraDetails, address },
        isFetched: true
      })
    );
  }

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
