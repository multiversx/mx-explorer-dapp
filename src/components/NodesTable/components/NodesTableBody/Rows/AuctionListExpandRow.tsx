import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { NodeType, WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { ExpandRowConfigType } from '../NodesTableBody';

export interface AuctionListExpandRowUIType extends WithClassnameType {
  nodeData: NodeType;
  index: number;
  expandRowConfig: ExpandRowConfigType;
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
      <td colSpan={colSpan}>
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
  expandRowConfig,
  showPosition,
  className
}: AuctionListExpandRowUIType) => {
  const {
    qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    dangerZoneExpandPosition,
    dangerZoneExpandClosePosition,
    remainingDangerZoneValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators,
    qualifiedExpanded,
    dangerZoneExpanded,
    notQualifiedExpanded,
    setQualifiedExpanded,
    setDangerZoneExpanded,
    setNotQualifiedExpanded
  } = expandRowConfig;

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
    return (
      <AuctionListBaseRow
        nodeData={nodeData}
        index={index}
        showPosition={showPosition}
        className={classNames('dh', {
          qv:
            qualifiedExpanded &&
            nodeData.auctionQualified &&
            !nodeData.isInDangerZone,
          dzv:
            dangerZoneExpanded &&
            nodeData.auctionQualified &&
            nodeData.isInDangerZone,
          nqv: notQualifiedExpanded && !nodeData.auctionQualified
        })}
      />
    );
  }

  if (
    hasQualifiedExpand &&
    index === qualifiedExpandClosePosition &&
    !qualifiedExpanded
  ) {
    return (
      <ExpandRow
        nodeCount={remainingQualifiedValidators}
        nodeText='Qualified nodes'
        onClick={() => {
          setQualifiedExpanded(true);
          return;
        }}
        colSpan={colSpan}
        className={className}
      />
    );
  }
  if (
    hasDangerZoneExpand &&
    index === dangerZoneExpandClosePosition &&
    !dangerZoneExpanded
  ) {
    return (
      <ExpandRow
        nodeCount={remainingDangerZoneValidators}
        nodeText='nodes in Danger Zone'
        onClick={() => {
          setDangerZoneExpanded(true);
          return;
        }}
        colSpan={colSpan}
        className={className}
      />
    );
  }
  if (
    hasNotQualifiedExpand &&
    index === notQualifiedExpandClosePosition &&
    !notQualifiedExpanded
  ) {
    return (
      <ExpandRow
        nodeCount={remainingNotQualifiedValidators}
        nodeText='Not Qualified nodes'
        onClick={() => {
          setNotQualifiedExpanded(true);
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
