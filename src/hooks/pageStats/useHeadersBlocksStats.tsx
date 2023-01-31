import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageHeaderStats } from 'redux/slices/pageHeadersStats';
import { useAdapter } from '../../components';
import {
  pageHeadersBlocksSelector,
  pageHeadersStatsSelector
} from '../../redux/selectors/pageHeadersStats';
import { HeadersBlocksType } from '../../types/headerStats.types';

export const useHeadersBlocksStats = () => {
  const pageHeaders = useSelector(pageHeadersStatsSelector);
  const headersBlocks = useSelector(pageHeadersBlocksSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersBlocks = async (): Promise<HeadersBlocksType> => {
    // if (headersBlocks != null) {
    //   return headersBlocks;
    // }

    const result = await getGrowthHeaders('/blocks');

    if (!result.success) {
      // dispatch(setPageHeaderStats(pageHeaders));
      return {} as HeadersBlocksType;
    }

    dispatch(
      setPageHeaderStats({
        ...pageHeaders,
        blocks: result.data
      })
    );
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
