import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useAdapter, useHasGrowthWidgets } from 'hooks';
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

  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const ecosystemMarketCap = new BigNumber(unprocessed.marketCap ?? '0').plus(
    unprocessed.tokenMarketCap ?? '0'
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
        ecosystemMarketCap: ecosystemMarketCap.isGreaterThan(0)
          ? ecosystemMarketCap.toFormat(0)
          : ELLIPSIS
      })
    );

    return result.data;
  };

  useEffect(() => {
    if (hasGrowthWidgets) {
      getHeadersTokens();
    }
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderBlocksStatsEcosystemMarketCap(
        ecosystemMarketCap.isGreaterThan(0)
          ? ecosystemMarketCap.toFormat(0)
          : ELLIPSIS
      )
    );
  }, [ecosystemMarketCap]);

  return {
    title: 'Tokens',
    headersTokens
  };
};
