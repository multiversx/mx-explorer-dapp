import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter, useHasGrowthWidgets } from 'hooks';
import { statsBlocksSelector } from 'redux/selectors';
import { pageHeadersBlocksStatsSelector } from 'redux/selectors';
import {
  setPageHeaderBlocksStats,
  setPageHeaderBlocksStatsBlockHeight
} from 'redux/slices';
import { HeadersBlocksType } from 'types/headerStats.types';

import { PageStatsOptionsType } from './types';

export const useHeadersBlocksStats = ({
  isEnabled = true
}: PageStatsOptionsType = {}) => {
  const headersBlocks = useSelector(pageHeadersBlocksStatsSelector);
  const statsBlocks = useSelector(statsBlocksSelector);

  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersBlocks = async (): Promise<HeadersBlocksType> => {
    if (headersBlocks.totalApplicationsDeployed !== undefined) {
      return headersBlocks;
    }

    const result = await getGrowthHeaders('/blocks');

    if (!result.success) {
      return {} as HeadersBlocksType;
    }

    dispatch(
      setPageHeaderBlocksStats({
        totalNetworkFees: new BigNumber(
          result.data.totalNetworkFees
        ).toFormat(),
        totalDeveloperRewards: new BigNumber(
          result.data.totalDeveloperRewards
        ).toFormat(),
        totalApplicationsDeployed: new BigNumber(
          result.data.totalApplicationsDeployed
        ).toFormat(),
        blockHeight: new BigNumber(statsBlocks).toFormat(0)
      })
    );
    return result.data;
  };

  useEffect(() => {
    if (hasGrowthWidgets && isEnabled) {
      getHeadersBlocks();
    }
  }, [hasGrowthWidgets, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    dispatch(
      setPageHeaderBlocksStatsBlockHeight(
        new BigNumber(statsBlocks).toFormat(0)
      )
    );
  }, [statsBlocks, isEnabled, dispatch]);

  return {
    title: 'Blocks',
    headersBlocks
  };
};
