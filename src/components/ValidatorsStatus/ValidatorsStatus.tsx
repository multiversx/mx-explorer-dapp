import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { ValidatorMap, Marquee } from 'components';
import { useFetchGlobalStake, useFetchMarkers } from 'hooks';
import {
  interfaceSelector,
  globalStakeSelector,
  markersSelector
} from 'redux/selectors';

import { calcContinentRank, RankType } from './helpers/calcContinentRank';

import {
  faGlobe,
  faEnvelope,
  faPencil,
  faFileAlt
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

export const ValidatorsStatus = ({
  isSmall = false
}: {
  isSmall?: boolean;
}) => {
  const ref = useRef(null);
  const { markers } = useSelector(markersSelector);
  const { totalValidators, unprocessed } = useSelector(globalStakeSelector);

  const [continentsRank, setContinentsRank] =
    useState<RankType[]>(placeHolderRank);

  useFetchMarkers();
  useFetchGlobalStake();

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
        isSmall ? 'validators-status-sm' : ''
      }`}
      ref={ref}
    >
      <div className='card-body p-0 overflow-hidden'>
        {process.env.NODE_ENV !== 'test' && markers.length > 0 && (
          <ValidatorMap markers={markers} />
        )}
        <div className='card-body p-4'>
          <p className='text-neutral-400 mb-0'>Validators</p>
          <h3 className='card-value'>{totalValidators}</h3>
        </div>

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
