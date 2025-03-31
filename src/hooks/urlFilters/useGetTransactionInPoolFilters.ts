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

  const type = searchParams.get('type') ? String(searchParams.get('type')) : '';

  const senderShard =
    getParam(TransactionFiltersEnum.senderShard, true) ??
    getParam('sendershard', true);

  const receiverShard =
    getParam(TransactionFiltersEnum.receiverShard, true) ??
    getParam('receivershard', true);

  return {
    senderShard,
    receiverShard,
    type: checkType(type),
    sender: getParam(TransactionFiltersEnum.sender),
    receiver: getParam(TransactionFiltersEnum.receiver)
  };
};
