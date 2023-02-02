import React from 'react';

import { ValidatorMap, ShardList } from 'components';

import { ContinentsRank } from './ContinentsRank';
import { ValidatorsStatusCardType } from '../types';

export const LargeCard = ({
  totalValidators,
  markers,
  continentsRank,
  className
}: ValidatorsStatusCardType) => {
  return (
    <div className={`card-body overflow-hidden ${className ?? ''}`}>
      <div className='card-title validator-card-title'>
        <p className='text-neutral-500 mb-0'>Validators</p>
        <h2 className='card-value text-primary'>{totalValidators}</h2>
      </div>
      <div className='row flex-wrap-reverse'>
        <ShardList className='col-md-5' />
        {process.env.NODE_ENV !== 'test' && markers.length > 0 && (
          <ValidatorMap markers={markers} className='col-md-7' />
        )}
        <ContinentsRank continentsRank={continentsRank} />
      </div>
    </div>
  );
};
