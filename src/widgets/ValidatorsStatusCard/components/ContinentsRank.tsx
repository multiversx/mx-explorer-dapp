import React from 'react';
import { faGlobe } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ELLIPSIS } from 'appConstants';
import { Marquee } from 'components';
import { WithClassnameType, RankType } from 'types';

export interface ContinentsRankType extends WithClassnameType {
  continentsRank: RankType[];
}

export const ContinentsRank = ({
  continentsRank,
  className
}: ContinentsRankType) => {
  return (
    <Marquee>
      <div
        className={`badge-holder d-flex flex-row align-items-center ${
          className ?? ''
        }`}
      >
        {continentsRank.map(({ continent, nodes, percentage }, i) => (
          <div
            key={`${continent}-${i}`}
            className='badge rounded-pill d-flex flex-row align-items-center'
          >
            <FontAwesomeIcon icon={faGlobe} />
            <div className='ms-2'>{continent}</div>
            <div className='text-secondary mx-1'>
              {nodes > 0
                ? `${nodes.toLocaleString('en')} node${nodes === 1 ? '' : 's'}`
                : ELLIPSIS}
            </div>
            <div>({percentage > 0 ? `${percentage}%` : ELLIPSIS})</div>
          </div>
        ))}
      </div>
    </Marquee>
  );
};
