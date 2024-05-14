import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

import { AuctionListBaseRow } from './AuctionListBaseRow';
import { ExpandRowConfigType, AuctionListBaseRowUIType } from './types';

export interface NodesAuctionListExpandRowUIType
  extends AuctionListBaseRowUIType {
  expandRowConfig: ExpandRowConfigType;
  colSpan?: number;
}

interface ExpandRowUIType extends WithClassnameType {
  validatorCount: number;
  validatorText: string;
  onClick: () => void;
  colSpan?: number;
}

const ExpandRow = ({
  validatorCount,
  validatorText,
  onClick,
  colSpan,
  className
}: ExpandRowUIType) => {
  return (
    <tr className={classNames('expand-row', className)}>
      <td colSpan={colSpan}>
        <div className='content-wrapper text-neutral-400 d-flex align-items-start font-headings-regular gap-3'>
          <span>
            .. {new BigNumber(validatorCount).toFormat()} more {validatorText}
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
        validatorCount={remainingQualifiedValidators}
        validatorText='Qualified validators'
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
        validatorCount={remainingNotQualifiedValidators}
        validatorText='Not Qualified validators'
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
