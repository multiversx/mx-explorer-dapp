import { useSearchParams } from 'react-router-dom';

import { TransactionInPoolTypeEnum } from 'types';

const checkType = (type: string) =>
  type && Object.keys(TransactionInPoolTypeEnum).includes(type)
    ? (type as TransactionInPoolTypeEnum)
    : undefined;

export const useGetTransactionInPoolFilters = () => {
  const [searchParams] = useSearchParams();

  const sender = searchParams.get('sender')
    ? String(searchParams.get('sender'))
    : '';
  const receiver = searchParams.get('receiver')
    ? String(searchParams.get('receiver'))
    : '';
  const type = searchParams.get('type') ? String(searchParams.get('type')) : '';

  return {
    sender,
    receiver,
    type: checkType(type)
  };
};
