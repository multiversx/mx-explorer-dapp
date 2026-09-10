import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';

import { isTouchDevice } from 'helpers';
import { useGetTransactionInPoolFilters } from 'hooks';
import { highlightedTextSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices';
import { TransactionInPoolTypeEnum } from 'types';

export interface TransactionInPoolTypeBadgeUIType {
  type: TransactionInPoolTypeEnum;
  hasHighlight?: boolean;
}

export const TransactionInPoolTypeBadge = ({
  type,
  hasHighlight
}: TransactionInPoolTypeBadgeUIType) => {
  const dispatch = useDispatch();
  const highlightedText = useSelector(highlightedTextSelector);
  const { type: filteredType } = useGetTransactionInPoolFilters();
  const [searchParams, setSearchParams] = useSearchParams();

  const isTouch = isTouchDevice();
  const isHighlightBadge = !isTouch && hasHighlight && highlightedText === type;

  const updateType = (newType: TransactionInPoolTypeEnum) => {
    const { page, size, type, ...rest } = Object.fromEntries(searchParams);
    if (newType) {
      delete rest.page;
    }
    const nextUrlParams = {
      ...rest,
      ...(newType ? { type: newType } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const renderTransactionTypeText = (children: React.ReactNode) => {
    return (
      <span>
        {filteredType !== type ? (
          <div
            onClick={() => {
              updateType(type);
            }}
            data-testid='filterByTransactionInPoolType'
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

  return (
    <div className='d-inline-block'>
      {renderTransactionTypeText(
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
                  dispatch(setHighlightedText(type));
                },
                onMouseLeave: () => dispatch(setHighlightedText(''))
              }
            : {})}
        >
          <div className='transaction-function-badge text-truncate text-capitalize'>
            {type}
          </div>
        </span>
      )}
    </div>
  );
};
