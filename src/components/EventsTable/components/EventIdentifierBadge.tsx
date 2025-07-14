import { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Overlay } from 'components';
import { isEllipsisActive, isTouchDevice } from 'helpers';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';

export interface EventIdentifierBadgeUIType {
  identifier: string;
  hasHighlight?: boolean;
}

export const EventIdentifierBadge = ({
  identifier,
  hasHighlight
}: EventIdentifierBadgeUIType) => {
  const badgeTextRef = useRef(null);
  const dispatch = useDispatch();
  const { highlightedText } = useSelector(interfaceSelector);

  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { identifier: filteredIdentifier } = Object.fromEntries(searchParams);
  const isTouch = isTouchDevice();
  const isHighlightBadge =
    !isTouch && hasHighlight && highlightedText === identifier;

  const updateIdentifier = (newIdentifier: string) => {
    const { page, size, identifier, ...rest } =
      Object.fromEntries(searchParams);
    if (newIdentifier) {
      delete rest.page;
    }
    const nextUrlParams = {
      ...rest,
      ...(newIdentifier ? { identifier: newIdentifier } : {})
    };

    setSearchParams(nextUrlParams);
  };

  useLayoutEffect(() => {
    if (badgeTextRef?.current) {
      setIsTextTruncated(isEllipsisActive(badgeTextRef?.current));
    }
  }, []);

  const TransactionIdentifierText = ({
    children
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <span>
        {filteredIdentifier !== identifier ? (
          <div
            onClick={() => {
              updateIdentifier(identifier);
            }}
            data-testid='filterByEventIdentifier'
            className='text-decoration-none cursor-pointer'
          >
            {children}
          </div>
        ) : (
          <span>{children}</span>
        )}
      </span>
    );
  };

  const TransactionIdentifierBadge = () => {
    return (
      <div className='d-inline-block'>
        <TransactionIdentifierText>
          <span
            className={classNames(
              'badge badge-outline badge-outline-primary-alt',
              {
                'badge-outline-highlight': isHighlightBadge
              }
            )}
            {...(hasHighlight && !isTouch
              ? {
                  onMouseEnter: () => {
                    dispatch(setHighlightedText(identifier));
                  },
                  onMouseLeave: () => dispatch(setHighlightedText(''))
                }
              : {})}
          >
            <div className='transaction-function-badge text-truncate text-capitalize'>
              {identifier}
            </div>
          </span>
        </TransactionIdentifierText>
      </div>
    );
  };

  return isTextTruncated ? (
    <Overlay
      title={<>{isTextTruncated && <p className='mb-0'>{identifier}</p>}</>}
      className='method-tooltip'
      persistent
    >
      <TransactionIdentifierBadge />
    </Overlay>
  ) : (
    <TransactionIdentifierBadge />
  );
};
