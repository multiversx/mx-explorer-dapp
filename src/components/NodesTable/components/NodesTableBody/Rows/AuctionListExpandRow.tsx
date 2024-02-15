import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { WithClassnameType } from 'types';

export interface AuctionListTresholdRowUIType extends WithClassnameType {
  colSpan?: number;
  remainingQualifiedValidators?: number;
  remainingDangerZoneValidators?: number;
  remainingNotQualifiedValidators?: number;
}

export const AuctionListExpandRow = ({
  colSpan = 7,
  remainingQualifiedValidators,
  remainingDangerZoneValidators,
  remainingNotQualifiedValidators,
  className
}: AuctionListTresholdRowUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const nodeQualifiedLink = (isQualified: boolean) => {
    const { isAuctionDangerZone, page, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isQualified !== undefined ? { isQualified: String(isQualified) } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const nodeDangerZoneLink = (isAuctionDangerZone: boolean) => {
    const { isQualified, page, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isAuctionDangerZone ? { isAuctionDangerZone: 'true' } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <tr className={classNames('expand-row', className)}>
      <td colSpan={colSpan} className='px-0'>
        <div className='content-wrapper text-neutral-400 d-flex align-items-start gap-3'>
          <span>
            ..{' '}
            {remainingQualifiedValidators ||
              remainingDangerZoneValidators ||
              remainingNotQualifiedValidators}{' '}
            more eligible nodes
          </span>
          <button
            type='button'
            className='btn btn-unstyled text-primary font-weight-600'
            onClick={() => {
              if (remainingQualifiedValidators) {
                nodeQualifiedLink(true);
                return;
              }
              if (remainingDangerZoneValidators) {
                nodeDangerZoneLink(true);
                return;
              }
              if (remainingNotQualifiedValidators) {
                nodeQualifiedLink(false);
                return;
              }
            }}
          >
            View All
          </button>
        </div>
        <div className='trapezoid'></div>
        <div className='trapezoid reverse'></div>
        <div className='trapezoid'></div>
        <div className='trapezoid reverse'></div>
      </td>
    </tr>
  );
};
