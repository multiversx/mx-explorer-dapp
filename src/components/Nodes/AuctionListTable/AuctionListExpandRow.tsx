import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { ExpandRow } from 'components';
import { AuctionListBaseRow } from './AuctionListBaseRow';
import { ExpandRowConfigType, AuctionListBaseRowUIType } from './types';

export interface NodesAuctionListExpandRowUIType
  extends AuctionListBaseRowUIType {
  expandRowConfig: ExpandRowConfigType;
  colSpan?: number;
}

export const AuctionListExpandRow = ({
  colSpan = 7,
  index,
  validator,
  details,
  expandRowConfig,
  showPosition,
  className
}: NodesAuctionListExpandRowUIType) => {
  const {
    qualifiedExpandPosition,
    qualifiedExpandClosePosition,
    remainingQualifiedValidators,
    notQualifiedExpandPosition,
    notQualifiedExpandClosePosition,
    remainingNotQualifiedValidators,
    qualifiedExpanded,
    notQualifiedExpanded,
    setQualifiedExpanded,
    setNotQualifiedExpanded
  } = expandRowConfig;

  const hasQualifiedExpand =
    qualifiedExpandPosition &&
    qualifiedExpandClosePosition &&
    remainingQualifiedValidators;

  const hasNotQualifiedExpand =
    notQualifiedExpandPosition &&
    notQualifiedExpandClosePosition &&
    remainingNotQualifiedValidators;

  const isQualifiedHidden =
    hasQualifiedExpand &&
    index >= qualifiedExpandPosition &&
    index < qualifiedExpandClosePosition;

  const isNotQualifiedHidden =
    hasNotQualifiedExpand &&
    index > (qualifiedExpandClosePosition || 0) &&
    index >= notQualifiedExpandPosition &&
    index < notQualifiedExpandClosePosition;

  if (isQualifiedHidden || isNotQualifiedHidden) {
    return (
      <AuctionListBaseRow
        validator={validator}
        details={details}
        index={index}
        showPosition={showPosition}
        className={classNames('dh', {
          qv:
            qualifiedExpanded &&
            new BigNumber(
              validator.qualifiedAuctionValidators ?? 0
            ).isGreaterThan(0),
          nqv:
            notQualifiedExpanded &&
            new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
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
        count={remainingQualifiedValidators}
        text='more Qualified validators'
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
    hasNotQualifiedExpand &&
    index === notQualifiedExpandClosePosition &&
    !notQualifiedExpanded
  ) {
    return (
      <ExpandRow
        count={remainingNotQualifiedValidators}
        text='more Not Qualified validators'
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
      validator={validator}
      details={details}
      index={index}
      showPosition={showPosition}
    />
  );
};
