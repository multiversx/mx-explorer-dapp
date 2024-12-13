import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { statsSelector } from 'redux/selectors';
import { pageHeadersBlocksStatsSelector } from 'redux/selectors/pageHeadersBlocksStats';
import { StatsCard } from 'widgets';

export const BlockHeightStatsCard = () => {
  const { unprocessed } = useSelector(statsSelector);
  const { blockHeight } = useSelector(pageHeadersBlocksStatsSelector);
  const bNBlocks = new BigNumber(unprocessed?.blocks);

  const displayStatsHeight =
    bNBlocks.isInteger() && bNBlocks.isGreaterThan(0)
      ? bNBlocks.toFormat(0)
      : undefined;
  const displayGrowthHeight =
    blockHeight && !isNaN(Number(blockHeight)) && Number(blockHeight) > 0
      ? blockHeight
      : undefined;

  const displayValue = displayStatsHeight || displayGrowthHeight || ELLIPSIS;

  return (
    <StatsCard
      title='Block Height'
      value={displayValue}
      className='card-solitary'
    />
  );
};
