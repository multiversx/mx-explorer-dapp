import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { pageHeaderTokensStatsSelector } from '../../redux/selectors/pageHeadersTokensStats';
import { setPageHeaderTokensStats } from '../../redux/slices/pageHeadersTokensStats';
import { HeadersTokensType } from '../../types/headerStats.types';

export const useHeadersTokensStats = () => {
  const headersTokens = useSelector(pageHeaderTokensStatsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersTokens = async (): Promise<HeadersTokensType> => {
    if (Object.keys(headersTokens).length !== 0) {
      return headersTokens;
    }

    const result = await getGrowthHeaders('/tokens');

    if (!result.success) {
      return {} as HeadersTokensType;
    }

    dispatch(setPageHeaderTokensStats(result.data));

    return result.data;
  };

  useEffect(() => {
    getHeadersTokens();
  }, []);

  return {
    title: 'Tokens',
    headersTokens
  };
};
