import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useFetchStake, useFetchMarkers, useFetchShards } from 'hooks';
import { stakeSelector, markersSelector } from 'redux/selectors';
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
  const { totalValidators, allStakedNodes, unprocessed } =
    useSelector(stakeSelector);

  const [continentsRank, setContinentsRank] =
    useState<RankType[]>(placeHolderRank);

  useFetchMarkers();
  useFetchStake();
  useFetchShards();

  useEffect(() => {
    if (markers.length > 0 && unprocessed?.totalValidators) {
      setContinentsRank(
        calcContinentRank(markers, unprocessed.totalValidators)
      );
    }
  }, [markers, unprocessed]);

  // TODO: temporay until changed on api
  const tempDisplay = allStakedNodes ?? totalValidators;

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
          totalValidators={tempDisplay}
        />
      )}
    </div>
  );
};
