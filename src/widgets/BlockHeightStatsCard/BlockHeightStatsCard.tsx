import React from 'react';
import { useSelector } from 'react-redux';

import { statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const BlockHeightStatsCard = ({
  neutralColors
}: {
  neutralColors?: boolean;
}) => {
  const { blocks } = useSelector(statsSelector);

  return (
    <StatsCard
      title='Block Height'
      value={blocks}
      className='card-solitary'
      neutralColors={neutralColors}
    />
  );
};
