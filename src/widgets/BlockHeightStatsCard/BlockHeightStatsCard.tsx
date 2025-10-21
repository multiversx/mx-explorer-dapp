import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS, POOLING_REFRESH_RATE_LIMIT } from 'appConstants';
import { FormatNumber } from 'components';
import { activeNetworkSelector, statsSelector } from 'redux/selectors';
import { pageHeadersBlocksStatsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const BlockHeightStatsCard = () => {
  const { refreshRate } = useSelector(activeNetworkSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { blockHeight } = useSelector(pageHeadersBlocksStatsSelector);
  const { blocks: statsBlocks } = unprocessed;

  const displayValue = useMemo(() => {
    const bNBlocks = new BigNumber(unprocessed?.blocks ?? 0);
    if (bNBlocks.isInteger() && bNBlocks.isGreaterThan(0)) {
      return bNBlocks.toNumber();
    }

    const bNToolsBlocks = new BigNumber(blockHeight ?? 0);
    if (bNToolsBlocks.isInteger() && bNToolsBlocks.isGreaterThan(0)) {
      return bNToolsBlocks.toNumber();
    }

    return ELLIPSIS;
  }, [blockHeight, statsBlocks]);

  const isAnimated = Boolean(
    refreshRate && refreshRate < POOLING_REFRESH_RATE_LIMIT
  );

  return (
    <StatsCard
      title='Block Height'
      value={
        <FormatNumber
          value={displayValue}
          isAnimated={isAnimated}
          showEllipsisIfZero
        />
      }
      className='card-solitary'
      isAnimated={isAnimated}
    />
  );
};
