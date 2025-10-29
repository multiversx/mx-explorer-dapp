import { ValidatorMap } from 'components';
import { formatBigNumber } from 'helpers';

import { ContinentsRank } from './ContinentsRank';
import { ValidatorsStatusCardType } from '../types';

export const SmallCard = ({
  totalValidators,
  markers,
  continentsRank,
  className
}: ValidatorsStatusCardType) => {
  return (
    <>
      <div className={`card-body overflow-hidden ${className ?? ''}`}>
        <div className='card-title validator-card-title'>
          <p className='text-neutral-400 font-headings mb-0'>Validators</p>
          <h2 className='card-value text-primary'>
            {formatBigNumber({
              value: totalValidators,
              showEllipsisIfZero: true
            })}
          </h2>
        </div>
        {markers.length > 0 && <ValidatorMap markers={markers} />}
      </div>
      {continentsRank && continentsRank.length > 0 && (
        <ContinentsRank continentsRank={continentsRank} />
      )}
    </>
  );
};
