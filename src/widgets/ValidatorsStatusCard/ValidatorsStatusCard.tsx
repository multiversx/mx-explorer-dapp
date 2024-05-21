import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useFetchStake, useFetchMarkers, useFetchShards } from 'hooks';
import { markersSelector, shardsSelector } from 'redux/selectors';
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
  const shards = useSelector(shardsSelector);

  const shardNodesCount = shards.reduce(
    (acc, shard) => acc + shard.validators,
    0
  );
  const shardTotalValidators = new BigNumber(shardNodesCount).toFormat(0);

  const [continentsRank, setContinentsRank] =
    useState<RankType[]>(placeHolderRank);

  useFetchMarkers();
  useFetchStake();
  useFetchShards();

  useEffect(() => {
    if (markers.length > 0 && shardNodesCount) {
      setContinentsRank(calcContinentRank(markers, shardNodesCount));
    }
  }, [markers, shardNodesCount]);

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
          totalValidators={shardTotalValidators}
        />
      ) : (
        <LargeCard
          continentsRank={continentsRank}
          markers={markers}
          totalValidators={shardTotalValidators}
        />
      )}
    </div>
  );
};
