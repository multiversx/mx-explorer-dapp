import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { isTouchDevice } from 'helpers';
import { useGetTransactionInPoolFilters } from 'hooks';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
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
  const { highlightedText } = useSelector(interfaceSelector);
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

  const TransactionTypeText = ({ children }: { children: React.ReactNode }) => {
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
      <TransactionTypeText>
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
      </TransactionTypeText>
    </div>
  );
};
