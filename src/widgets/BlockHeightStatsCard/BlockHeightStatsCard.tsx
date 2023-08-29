import { useSelector } from 'react-redux';

import { statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const BlockHeightStatsCard = () => {
  const { blocks } = useSelector(statsSelector);

  return (
    <StatsCard title='Block Height' value={blocks} className='card-solitary' />
  );
};
