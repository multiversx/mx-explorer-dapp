import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { Overlay } from 'components';
import { faDownRight, faUpRight } from 'icons/regular';
import { NodeType, WithClassnameType } from 'types';

export interface NodeRatingType extends WithClassnameType {
  node: NodeType;
}

const getNodeRatingDisplay = (ratingDifference: BigNumber) => {
  const shouldDisplayDifference = ratingDifference
    .absoluteValue()
    .isGreaterThanOrEqualTo(0.1);

  if (ratingDifference.isZero() || !shouldDisplayDifference) {
    return {
      icon: undefined,
      iconColor: ''
    };
  }
  if (ratingDifference.isPositive()) {
    return {
      icon: faUpRight,
      iconColor: 'text-success'
    };
  }
  if (ratingDifference.isNegative()) {
    return {
      icon: faDownRight,
      iconColor: 'text-danger'
    };
  }
  return {
    icon: undefined,
    iconColor: ''
  };
};

export const NodeRating = ({ node, className }: NodeRatingType) => {
  const { rating, tempRating } = node;

  if (isNaN(tempRating)) {
    return <span className='text-neutral-400'>N/A</span>;
  }

  const bNtempRating = new BigNumber(tempRating || 0);
  const bNRating = new BigNumber(rating || 0);

  const ratingDifference = bNtempRating.minus(bNRating);
  const { icon, iconColor } = getNodeRatingDisplay(ratingDifference);

  return (
    <div className={classNames('d-flex align-items-center gap-2', className)}>
      {bNtempRating.toFormat(0)}
      {icon && iconColor && (
        <Overlay
          title={`${
            ratingDifference.isPositive()
              ? `+${ratingDifference.toFormat()}`
              : ratingDifference.toFormat()
          } compared to Epoch Start Rating`}
        >
          <FontAwesomeIcon
            icon={icon}
            className={classNames('cursor-context', iconColor)}
          />
        </Overlay>
      )}
    </div>
  );
};
