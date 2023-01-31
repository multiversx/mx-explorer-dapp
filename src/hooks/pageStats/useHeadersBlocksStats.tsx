import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { pageHeadersBlocksStatsSelector } from '../../redux/selectors/pageHeadersBlocksStats';
import { setPageHeaderBlocksStats } from '../../redux/slices/pageHeadersBlocksStats';
import { HeadersBlocksType } from '../../types/headerStats.types';

export const useHeadersBlocksStats = () => {
  const headersBlocks = useSelector(pageHeadersBlocksStatsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersBlocks = async (): Promise<HeadersBlocksType> => {
    if (Object.keys(headersBlocks).length !== 0) {
      return headersBlocks;
    }

    const result = await getGrowthHeaders('/blocks');

    if (!result.success) {
      // dispatch(setPageHeaderStats(pageHeaders));
      return {} as HeadersBlocksType;
    }

    dispatch(setPageHeaderBlocksStats(result.data));
    return result.data;
  };

  useEffect(() => {
    getHeadersBlocks();
  }, []);

  return {
    title: 'Blocks',
    headersBlocks
  };
};
