import { useSearchParams } from 'react-router-dom';

import { cleanUrlFilters, getUrlParam } from 'helpers';
import { TransactionApiStatusEnum, TransactionFiltersEnum } from 'types';

const checkStatus = (status: string) =>
  status && Object.keys(TransactionApiStatusEnum).includes(status.toLowerCase())
    ? status.toLowerCase()
    : undefined;

export const useGetTransactionFilters = () => {
  const [searchParams] = useSearchParams();
  const getParam = getUrlParam(searchParams);

  const status = searchParams.get(TransactionFiltersEnum.status)
    ? String(searchParams.get(TransactionFiltersEnum.status))
    : '';

  const senderShard =
    getParam(TransactionFiltersEnum.senderShard, true) ??
    getParam('sendershard', true);

  const receiverShard =
    getParam(TransactionFiltersEnum.receiverShard, true) ??
    getParam('receivershard', true);

  const filters = {
    senderShard,
    receiverShard,
    sender: getParam(TransactionFiltersEnum.sender),
    receiver: getParam(TransactionFiltersEnum.receiver),
    before: getParam(TransactionFiltersEnum.before, true),
    after: getParam(TransactionFiltersEnum.after, true),
    status: checkStatus(status),
    miniBlockHash: getParam(TransactionFiltersEnum.miniBlockHash),
    method: getParam(TransactionFiltersEnum.method),
    hashes: getParam(TransactionFiltersEnum.hashes),
    token: getParam(TransactionFiltersEnum.token),
    relayer: getParam(TransactionFiltersEnum.relayer),
    isRelayed: getParam(TransactionFiltersEnum.isRelayed)
  };

  return cleanUrlFilters(filters);
};
