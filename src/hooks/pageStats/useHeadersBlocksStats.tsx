import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { statsSelector } from 'redux/selectors';
import { pageHeadersBlocksStatsSelector } from 'redux/selectors/pageHeadersBlocksStats';
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
        totalNetworkFees: new BigNumber(result.data.totalNetworkFees).toFormat(
          0
        ),
        totalDeveloperRewards: new BigNumber(
          result.data.totalDeveloperRewards
        ).toFormat(0),
        totalApplicationsDeployed: new BigNumber(
          result.data.totalApplicationsDeployed
        ).toFormat(0),
        blockHeight: new BigNumber(unprocessed.blocks).toFormat(0)
      })
    );
    return result.data;
  };

  useEffect(() => {
    getHeadersBlocks();
  }, []);

  useEffect(() => {
    dispatch(
      setPageHeaderBlocksStatsBlockHeight(
        new BigNumber(unprocessed.blocks).toFormat(0)
      )
    );
  }, [unprocessed.blocks, headersBlocks]);

  return {
    title: 'Blocks',
    headersBlocks
  };
};
