import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import {
  Denominate,
  MultilayerPercentageRing,
  SharedIdentity,
  Trim,
  MultilayerPercentageBar
} from 'components';
import { faExclamationTriangle, faClock } from 'icons/solid';
import { NodeType, WithClassnameType } from 'types';

import { NodesEligibilityPercentageBar } from './components';

export interface NodesTableHeroUIType extends WithClassnameType {
  data?: any;
}

export const NodesTableHero = ({ className }: NodesTableHeroUIType) => {
  return (
    <div className={classNames('nodes-table-hero w-100 mb-3', className)}>
      <div className='row gy-3'>
        <div className='col-xl-7'>
          <div className='card bg-neutral-800'>
            <div className='card-body d-flex flex-column gap-3'>
              <h4 className='mb-0'>Eligible Nodes</h4>
              <NodesEligibilityPercentageBar />
            </div>
          </div>
        </div>
        <div className='col-xl-5'>
          <div className='d-flex flex-column gap-3 h-100'>
            <div className='card bg-neutral-800 flex-fill'>
              <div className='card-body d-flex align-items-center'>
                <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                  <div className='text-primary-100 small'>
                    <FontAwesomeIcon icon={faClock} className='me-2' />
                    Epoch 1262 ends in
                  </div>
                  <h3 className='mb-0 text-primary text-lh-24'>
                    3h 45min 12sec
                  </h3>
                </div>
              </div>
            </div>
            <div className='card bg-neutral-800 flex-fill'>
              <div className='card-body d-flex align-items-center'>
                <div className='d-flex w-100 flex-wrap gap-3 align-items-start justify-content-between'>
                  <div className='text-neutral-500 small'>
                    Node Eligibility Threshold
                  </div>
                  <h3 className='mb-0 text-lh-24'>
                    <Denominate
                      value='1743213300000000000000'
                      superSuffix
                      decimals={4}
                    />
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
