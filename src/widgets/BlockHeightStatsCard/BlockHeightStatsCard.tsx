import { useMemo, useRef } from 'react';
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

  const higherRef = useRef<number>(0);

  const displayValue = useMemo(() => {
    const bNBlocks = new BigNumber(statsBlocks ?? 0);
    const bNToolsBlocks = new BigNumber(
      blockHeight ? String(blockHeight).replaceAll(',', '') : 0
    );

    const highest = bNBlocks.isGreaterThan(bNToolsBlocks)
      ? bNBlocks
      : bNToolsBlocks;

    if (highest.isInteger() && highest.isGreaterThan(0)) {
      const num = highest.toNumber();
      if (num > higherRef.current) {
        higherRef.current = num;
      }
    }

    return higherRef.current > 0 ? higherRef.current : ELLIPSIS;
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
