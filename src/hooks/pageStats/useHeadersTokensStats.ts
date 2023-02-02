import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'hooks';
import { economicsSelector } from 'redux/selectors';
import { pageHeaderTokensStatsSelector } from 'redux/selectors/pageHeadersTokensStats';
import {
  setPageHeaderBlocksStatsEcosystemMarketCap,
  setPageHeaderTokensStats
} from 'redux/slices/pageHeadersTokensStats';
import { HeadersTokensType } from 'types/headerStats.types';

export const useHeadersTokensStats = () => {
  const headersTokens = useSelector(pageHeaderTokensStatsSelector);
  const { unprocessed } = useSelector(economicsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const ecosystemMarketCap = new BigNumber(unprocessed.marketCap).plus(
    unprocessed.tokenMarketCap
  );

  const getHeadersTokens = async (): Promise<HeadersTokensType> => {
    if (Object.keys(headersTokens).length !== 0) {
      return headersTokens;
    }

    const result = await getGrowthHeaders('/tokens');

    if (!result.success) {
      return {} as HeadersTokensType;
    }

    dispatch(
      setPageHeaderTokensStats({
        totalTokens: new BigNumber(result.data.totalTokens).toFormat(0),
        newTokensInLast30d: new BigNumber(
          result.data.newTokensInLast30d
        ).toFormat(0),
        tokenTransfersInLast30d: new BigNumber(
          result.data.tokenTransfersInLast30d
        ).toFormat(0),
        ecosystemMarketCap: ecosystemMarketCap.toFormat(0)
      })
    );

    return result.data;
  };

  useEffect(() => {
    getHeadersTokens();
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderBlocksStatsEcosystemMarketCap(ecosystemMarketCap.toFormat(0))
    );
  }, [ecosystemMarketCap]);

  return {
    title: 'Tokens',
    headersTokens
  };
};
