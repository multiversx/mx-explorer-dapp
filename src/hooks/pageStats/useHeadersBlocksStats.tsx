import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { statsSelector } from '../../redux/selectors';
import { pageHeadersBlocksStatsSelector } from '../../redux/selectors/pageHeadersBlocksStats';
import {
  setPageHeaderBlocksStats,
  setPageHeaderBlocksStatsBlockHeight
} from '../../redux/slices/pageHeadersBlocksStats';
import { HeadersBlocksType } from '../../types/headerStats.types';

export const useHeadersBlocksStats = () => {
  const headersBlocks = useSelector(pageHeadersBlocksStatsSelector);
  const { unprocessed } = useSelector(statsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersBlocks = async (): Promise<HeadersBlocksType> => {
    if (Object.keys(headersBlocks).length !== 0) {
      return headersBlocks;
    }

    const result = await getGrowthHeaders('/blocks');

    if (!result.success) {
      return {} as HeadersBlocksType;
    }

    dispatch(
      setPageHeaderBlocksStats({
        ...result.data,
        blockHeight: unprocessed.blocks
      })
    );
    return result.data;
  };

  useEffect(() => {
    getHeadersBlocks();
  }, []);

  useEffect(() => {
    dispatch(setPageHeaderBlocksStatsBlockHeight(unprocessed.blocks));
  }, [unprocessed.blocks, headersBlocks]);

  return {
    title: 'Blocks',
    headersBlocks
  };
};
