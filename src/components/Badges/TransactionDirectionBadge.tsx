import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { isTouchDevice } from 'helpers';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
import { TransactionDirectionEnum, WithClassnameType } from 'types';

export enum TransactionDirectionDisplayEnum {
  out = 'Out',
  in = 'In',
  self = 'Self',
  internal = 'Int',
  inner = 'Inner Tx'
}

const getDisplayDirection = (direction: TransactionDirectionEnum) => {
  switch (direction) {
    case TransactionDirectionEnum.in:
      return TransactionDirectionDisplayEnum.in;
    case TransactionDirectionEnum.self:
      return TransactionDirectionDisplayEnum.self;
    case TransactionDirectionEnum.internal:
      return TransactionDirectionDisplayEnum.internal;
    case TransactionDirectionEnum.inner:
      return TransactionDirectionDisplayEnum.inner;
    case TransactionDirectionEnum.out:
      return TransactionDirectionDisplayEnum.out;
    default:
      return null;
  }
};

export const TransactionDirectionBadge = ({
  direction,
  hasHighlight,
  className
}: {
  direction: TransactionDirectionEnum;
  hasHighlight?: boolean;
} & WithClassnameType) => {
  const dispatch = useDispatch();
  const { highlightedText } = useSelector(interfaceSelector);

  const isTouch = isTouchDevice();
  const isHighlightBadge =
    !isTouch && hasHighlight && highlightedText === direction;
  const displayDirection = getDisplayDirection(direction);

  if (!displayDirection) {
    return null;
  }

  return (
    <div
      className={classNames(
        'badge badge-outline badge-rounded badge-direction',
        { 'badge-outline-highlight': Boolean(isHighlightBadge) },
        direction.toLowerCase(),
        className
      )}
      {...(hasHighlight && !isTouch
        ? {
            onMouseEnter: () => {
              dispatch(setHighlightedText(direction));
            },
            onMouseLeave: () => dispatch(setHighlightedText(''))
          }
        : {})}
    >
      {displayDirection.toUpperCase()}
    </div>
  );
};
