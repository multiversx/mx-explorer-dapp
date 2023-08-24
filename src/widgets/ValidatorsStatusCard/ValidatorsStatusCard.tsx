import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useFetchGlobalStake, useFetchMarkers, useFetchShards } from 'hooks';
import { globalStakeSelector, markersSelector } from 'redux/selectors';
import { RankType } from 'types';

import { LargeCard } from './components/LargeCard';
import { SmallCard } from './components/SmallCard';
import { calcContinentRank } from './helpers/calcContinentRank';
import { ValidatorsStatusType } from './types';

const placeHolderRank = [
  {
    continent: ELLIPSIS,
    nodes: 0,
    percentage: 0
  },
  {
    continent: ELLIPSIS,
    nodes: 0,
    percentage: 0
  },
  {
    continent: ELLIPSIS,
    nodes: 0,
    percentage: 0
  },
  {
    continent: ELLIPSIS,
    nodes: 0,
    percentage: 0
  }
];

export const ValidatorsStatusCard = ({
  isSmall = false,
  className
}: ValidatorsStatusType) => {
  const ref = useRef(null);

  const { markers } = useSelector(markersSelector);
  const { totalValidators, unprocessed } = useSelector(globalStakeSelector);

  const [continentsRank, setContinentsRank] =
    useState<RankType[]>(placeHolderRank);

  useFetchMarkers();
  useFetchGlobalStake();
  useFetchShards();

  useEffect(() => {
    if (markers.length > 0 && unprocessed?.totalValidators) {
      setContinentsRank(
        calcContinentRank(markers, unprocessed.totalValidators)
      );
    }
  }, [markers, unprocessed]);

  return (
    <div
      className={`card validators-status-card ${
        isSmall ? 'validators-status-sm' : 'validators-status-lg'
      } ${className ?? ''}`}
      ref={ref}
    >
      {isSmall ? (
        <SmallCard
          continentsRank={continentsRank}
          markers={markers}
          totalValidators={totalValidators}
        />
      ) : (
        <LargeCard
          continentsRank={continentsRank}
          markers={markers}
          totalValidators={totalValidators}
        />
      )}
    </div>
  );
};
