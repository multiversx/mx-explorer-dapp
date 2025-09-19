import { useSearchParams } from 'react-router-dom';

import { getUrlParam } from 'helpers';
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

  return {
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...(type ? { type } : {}),
    ...(sender ? { sender } : {}),
    ...(receiver ? { receiver } : {})
  };
};
