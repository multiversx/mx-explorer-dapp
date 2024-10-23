import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ValidatorMap, ShardList, MultilayerPercentageRing } from 'components';
import { useIsMainnet } from 'hooks';
import { nodesVersionsSelector } from 'redux/selectors';

import { ContinentsRank } from './ContinentsRank';

import { ValidatorsStatusCardType } from '../types';

export const LargeCard = ({
  totalValidators,
  markers,
  continentsRank,
  className
}: ValidatorsStatusCardType) => {
  const isMainnet = useIsMainnet();
  const { nodesVersions } = useSelector(nodesVersionsSelector);

  return (
    <div className={`card-body overflow-hidden ${className ?? ''}`}>
      <div className='card-title validator-card-title'>
        <p className='text-neutral-500 font-headings mb-0'>Validators</p>
        <h2 className='card-value text-primary'>
          {totalValidators ?? ELLIPSIS}
        </h2>
      </div>
      <div className='row flex-wrap-reverse'>
        <ShardList className='col-md-5' />
        {import.meta.env.NODE_ENV !== 'test' &&
          markers.length > 0 &&
          isMainnet && (
            <>
              <ValidatorMap
                markers={markers}
                className='col-md-7 position-relative'
              />
              <ContinentsRank continentsRank={continentsRank} />
            </>
          )}
        <div
          className={
            isMainnet
              ? 'd-none d-lg-flex card distribution-card bg-neutral-900 weighted-node-card'
              : 'col-md-6 ms-auto d-none d-md-flex'
          }
        >
          <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
            <div className='distribution-card-title font-headings text-neutral-500 mb-2'>
              Stake Weighted Node Version
            </div>
            <div className='distribution-card-value'>
              <MultilayerPercentageRing steps={nodesVersions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
