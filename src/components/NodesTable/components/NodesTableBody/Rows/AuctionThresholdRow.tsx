import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmount } from 'components';
import { faDown, faUp } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface AuctionThresholdRowUIType extends WithClassnameType {
  colSpan?: number;
  isSortDesc?: boolean;
}

export const AuctionThresholdRow = ({
  colSpan = 7,
  isSortDesc,
  className
}: AuctionThresholdRowUIType) => {
  const { isFetched: isStakeFetched, unprocessed } = useSelector(stakeSelector);

  return (
    <tr className={classNames('threshold-row', className)}>
      <td colSpan={colSpan} className='px-0'>
        <div className='d-flex flex-row gap-5 align-items-center my-spacer'>
          <div className='d-flex flex-fill flex-column w-0'>
            <div className='d-flex align-items-center gap-2 text-neutral-500'>
              <FontAwesomeIcon icon={faUp} />
              {isSortDesc ? 'Not Qualified' : 'Qualified'}
            </div>
            <hr className='d-flex flex-fill text-neutral-800 opacity-100 my-2' />
            <div className='d-flex align-items-center gap-2 text-neutral-500'>
              <FontAwesomeIcon icon={faDown} />
              {isSortDesc ? 'Qualified' : 'Not Qualified'}
            </div>
          </div>

          <div className='text-center'>
            <p className='mb-0 text-neutral-500 small'>
              Node Qualification Threshold
            </p>
            <h1>
              {isStakeFetched && unprocessed.minimumAuctionQualifiedStake ? (
                <FormatAmount
                  value={unprocessed.minimumAuctionQualifiedStake}
                  digits={4}
                  superSuffix
                />
              ) : (
                ELLIPSIS
              )}
            </h1>
          </div>
          <div className='d-flex flex-fill flex-column'>
            <hr className='d-flex flex-fill text-neutral-800 opacity-100' />
          </div>
        </div>
      </td>
    </tr>
  );
};
