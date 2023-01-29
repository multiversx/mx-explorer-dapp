import React, { useEffect, useRef, useState } from 'react';
import { faGlobe } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSelector } from 'react-redux';
import { ValidatorMap, Marquee, ShardList } from 'components';
import { useFetchGlobalStake, useFetchMarkers, useFetchShards } from 'hooks';
import { globalStakeSelector, markersSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { calcContinentRank, RankType } from './helpers/calcContinentRank';

export interface ValidatorsStatusType extends WithClassnameType {
  isSmall?: boolean;
}

const placeHolderRank = [
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
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
      className={`card validators-status ${
        isSmall ? 'validators-status-sm' : 'validators-status-lg'
      } ${className ?? ''}`}
      ref={ref}
    >
      <div className='card-body p-0 overflow-hidden'>
        {process.env.NODE_ENV !== 'test' && markers.length > 0 && (
          <ValidatorMap markers={markers} />
        )}
        <div className='card-body validators-total'>
          <p className='text-neutral-400 mb-0'>Validators</p>
          <h2 className='card-value text-primary'>{totalValidators}</h2>
        </div>
        {!isSmall && (
          <div className='card-body py-0 d-flex'>
            <ShardList />
          </div>
        )}

        <Marquee>
          <div className='badge-holder d-flex flex-row align-items-center'>
            {continentsRank.map(({ continent, nodes, percentage }, i) => (
              <div
                key={i}
                className='badge rounded-pill d-flex flex-row align-items-center'
              >
                <FontAwesomeIcon icon={faGlobe} />
                <div className='ms-2'>{continent}</div>
                <div className='text-secondary mx-1'>
                  {nodes > 0
                    ? `${nodes.toLocaleString('en')} node${
                        nodes === 1 ? '' : 's'
                      }`
                    : '...'}
                </div>
                <div>({percentage > 0 ? `${percentage}%` : '...'})</div>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};
