import { useSearchParams } from 'react-router-dom';

import { cleanUrlFilters, getUrlParam } from 'helpers';
import { TransactionInPoolTypeEnum, TransactionFiltersEnum } from 'types';

const checkType = (type: string) =>
  type && Object.keys(TransactionInPoolTypeEnum).includes(type)
    ? (type as TransactionInPoolTypeEnum)
    : undefined;

export const useGetTransactionInPoolFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  const senderShard =
    getParam(TransactionFiltersEnum.senderShard, true) ??
    getParam('sendershard', true);

  const receiverShard =
    getParam(TransactionFiltersEnum.receiverShard, true) ??
    getParam('receivershard', true);

  const type = checkType(
    searchParams.get('type') ? String(searchParams.get('type')) : ''
  );

  const sender = getParam(TransactionFiltersEnum.sender);
  const receiver = getParam(TransactionFiltersEnum.receiver);

  const filters = {
    senderShard,
    receiverShard,
    type,
    sender,
    receiver
  };

  return cleanUrlFilters(filters);
};
