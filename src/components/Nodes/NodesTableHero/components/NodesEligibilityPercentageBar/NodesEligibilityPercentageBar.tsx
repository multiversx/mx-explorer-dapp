import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import {
  Denominate,
  MultilayerPercentageRing,
  SharedIdentity,
  Trim,
  MultilayerPercentageBar,
  Overlay,
  Led
} from 'components';
import { faExclamationTriangle, faClock, faSquareInfo } from 'icons/solid';
import { WithClassnameType, MultilayerPercentageUIType } from 'types';

export interface NodesEligibilityPercentageBarUIType extends WithClassnameType {
  data?: any;
}

export const NodesEligibilityPercentageBar = ({
  className
}: NodesEligibilityPercentageBarUIType) => {
  return (
    <MultilayerPercentageBar
      steps={[
        {
          name: 'Not Eligible',
          value: 34,
          legend: (
            <div className='legend' style={{ width: `${34}%` }}>
              <div className='name'>Not Eligible</div>
              <div className='description'>1,092</div>
              <div className='value'>34%</div>
            </div>
          )
        },
        {
          name: 'Danger Zone',
          value: 11,
          legend: (
            <div className='legend' style={{ width: `${11}%` }}>
              <div className='name'>
                Danger Zone
                <Overlay
                  title={
                    <>
                      <p className='mb-2 h6'>
                        Danger Zone <Led color='bg-danger ms-1' />
                      </p>
                      <p className='text-neutral-400 mb-0'>
                        100 nodes are 5% above the threshold level. Increase the
                        staked amount / node to exit the danger zone and move up
                        on the auction list.
                      </p>
                    </>
                  }
                  className='side-action cursor-context'
                  tooltipClassName='tooltip-start tooltip-lg'
                >
                  <FontAwesomeIcon icon={faSquareInfo} />
                </Overlay>
              </div>
              <div className='description'>100</div>
              <div className='value'>34%</div>
            </div>
          )
        },
        {
          name: 'Eligible',
          value: 55,
          legend: (
            <div className='legend' style={{ width: `${55}%` }}>
              <div className='name'>Eligible</div>
              <div className='description'>3,200</div>
              <div className='value'>34%</div>
            </div>
          )
        }
      ]}
      className={classNames('nodes-eligibility-percentage-bar', className)}
      legendClassName='eligibility-legend-container'
    />
  );
};
