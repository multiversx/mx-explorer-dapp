import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ExpandRowDetailsType } from 'helpers/getValue/getExpandRowDetails';
import { NodeType, WithClassnameType } from 'types';
import { AuctionListBaseRow } from './AuctionListBaseRow';

export interface AuctionListExpandRowUIType extends WithClassnameType {
  nodeData: NodeType;
  index: number;
  expandRowDetails: ExpandRowDetailsType;
  colSpan?: number;
  showPosition?: boolean;
}

interface ExpandRowUIType extends WithClassnameType {
  nodeCount: number;
  nodeText: string;
  onClick: () => void;
  colSpan?: number;
}

const ExpandRow = ({
  nodeCount,
  nodeText,
  onClick,
  colSpan,
  className
}: ExpandRowUIType) => {
  return (
    <tr className={classNames('expand-row', className)}>
      <td colSpan={colSpan} className='px-0'>
        <div className='content-wrapper text-neutral-400 d-flex align-items-start gap-3'>
          <span>
            .. {new BigNumber(nodeCount).toFormat()} more {nodeText}
          </span>
          <button
            type='button'
            className='btn btn-link-unstyled text-primary font-weight-600'
            onClick={onClick}
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

export const AuctionListExpandRow = ({
  colSpan = 7,
  index,
  nodeData,
  expandRowDetails,
  showPosition,
  className
}: AuctionListExpandRowUIType) => {
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
      ...(isAuctionDangerZone
        ? { isAuctionDangerZone: 'true', isQualified: 'true' }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const {
    qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    dangerZoneExpandPosition,
    dangerZoneExpandClosePosition,
    remainingDangerZoneValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators
  } = expandRowDetails;

  const hasQualifiedExpand =
    qualifiedExpandPosition &&
    qualifiedExpandClosePosition &&
    remainingQualifiedValidators;
  const hasDangerZoneExpand =
    dangerZoneExpandPosition &&
    dangerZoneExpandClosePosition &&
    remainingDangerZoneValidators;
  const hasNotQualifiedExpand =
    notQualifiedExpandPosition &&
    notQualifiedExpandClosePosition &&
    remainingNotQualifiedValidators;

  const isQualifiedHidden =
    hasQualifiedExpand &&
    index >= qualifiedExpandPosition &&
    index < qualifiedExpandClosePosition;
  const isDangerZoneHidden =
    hasDangerZoneExpand &&
    index >= dangerZoneExpandPosition &&
    index < dangerZoneExpandClosePosition;
  const isNotQualifiedHidden =
    hasNotQualifiedExpand &&
    index >= notQualifiedExpandPosition &&
    index < notQualifiedExpandClosePosition;

  if (isQualifiedHidden || isDangerZoneHidden || isNotQualifiedHidden) {
    return null;
  }

  if (hasQualifiedExpand && index === qualifiedExpandClosePosition) {
    return (
      <ExpandRow
        nodeCount={remainingQualifiedValidators}
        nodeText='Qualified nodes'
        onClick={() => {
          nodeQualifiedLink(true);
          return;
        }}
        colSpan={colSpan}
        className={className}
      />
    );
  }
  if (hasDangerZoneExpand && index === dangerZoneExpandClosePosition) {
    return (
      <ExpandRow
        nodeCount={remainingDangerZoneValidators}
        nodeText='nodes in Danger Zone'
        onClick={() => {
          nodeDangerZoneLink(true);
          return;
        }}
        colSpan={colSpan}
        className={className}
      />
    );
  }
  if (hasNotQualifiedExpand && index === notQualifiedExpandClosePosition) {
    return (
      <ExpandRow
        nodeCount={remainingNotQualifiedValidators}
        nodeText='Not Qualified nodes'
        onClick={() => {
          nodeQualifiedLink(false);
          return;
        }}
        colSpan={colSpan}
        className={className}
      />
    );
  }

  return (
    <AuctionListBaseRow
      nodeData={nodeData}
      index={index}
      showPosition={showPosition}
    />
  );
};
