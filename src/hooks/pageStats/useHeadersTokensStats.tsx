import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { economicsSelector } from '../../redux/selectors';
import { pageHeaderTokensStatsSelector } from '../../redux/selectors/pageHeadersTokensStats';
import {
  setPageHeaderBlocksStatsEcosystemMarketCap,
  setPageHeaderTokensStats
} from '../../redux/slices/pageHeadersTokensStats';
import { HeadersTokensType } from '../../types/headerStats.types';

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
        ...result.data,
        ecosystemMarketCap: ecosystemMarketCap.toNumber()
      })
    );

    return result.data;
  };

  useEffect(() => {
    getHeadersTokens();
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderBlocksStatsEcosystemMarketCap(ecosystemMarketCap.toNumber())
    );
  }, [ecosystemMarketCap]);

  return {
    title: 'Tokens',
    headersTokens
  };
};
