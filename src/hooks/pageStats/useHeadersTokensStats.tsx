import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  pageHeadersStatsSelector,
  pageHeadersTokensSelector
} from 'redux/selectors/pageHeadersStats';
import { setPageHeaderStats } from 'redux/slices/pageHeadersStats';
import { useAdapter } from '../../components';
import { HeadersTokensType } from '../../types/headerStats.types';

export const useHeadersTokensStats = () => {
  const pageHeaders = useSelector(pageHeadersStatsSelector);
  const headersTokens = useSelector(pageHeadersTokensSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersTokens = async (): Promise<HeadersTokensType> => {
    const result = await getGrowthHeaders('/tokens');

    if (!result.success) {
      // dispatch(setPageHeaderStats(pageHeaders));
      return {} as HeadersTokensType;
    }

    dispatch(
      setPageHeaderStats({
        ...pageHeaders,
        tokens: result.data
      })
    );

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
