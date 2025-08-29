import { useSearchParams } from 'react-router-dom';

import { TransactionDirectionBadge } from 'components';
import { getTransactionDirection } from 'helpers';
import { TransactionDirectionEnum, UITransactionType } from 'types';

export interface TransactionDirectionType {
  transaction: UITransactionType;
  address?: string;
}

export const TransactionDirection = ({
  transaction,
  address
}: TransactionDirectionType) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const direction = getTransactionDirection({ transaction, address });
  const { sender, receiver } = Object.fromEntries(searchParams);

  const isReceiver = address && receiver?.split(',')?.includes(address);

  const isFiltered =
    (direction === TransactionDirectionEnum.out && sender === address) ||
    (direction === TransactionDirectionEnum.in && isReceiver);

  const isFilterable =
    direction &&
    [TransactionDirectionEnum.out, TransactionDirectionEnum.in].includes(
      direction
    );

  const isClickable = Boolean(!isFiltered && isFilterable);

  if (!address || !direction) {
    return null;
  }

  const updateDirection = (direction: TransactionDirectionEnum) => {
    const { page, size, sender, receiver, ...rest } =
      Object.fromEntries(searchParams);

    switch (direction) {
      case TransactionDirectionEnum.in:
        setSearchParams({
          receiver: address,
          ...rest
        });
        break;
      case TransactionDirectionEnum.out:
        setSearchParams({
          sender: address,
          ...rest
        });
        break;
      default:
        setSearchParams(rest);
        break;
    }
  };

  const TransactionDirectionWrapper = ({
    children
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <>
        {isClickable ? (
          <div
            onClick={() => {
              updateDirection(direction);
            }}
            data-testid='filterByTransactionDirection'
            className='text-decoration-none cursor-pointer'
          >
            {children}
          </div>
        ) : (
          <span>{children}</span>
        )}
      </>
    );
  };

  return (
    <div className='d-inline-block'>
      <TransactionDirectionWrapper>
        <TransactionDirectionBadge direction={direction} hasHighlight />
      </TransactionDirectionWrapper>
    </div>
  );
};
