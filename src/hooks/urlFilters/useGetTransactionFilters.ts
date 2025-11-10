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
    getParam(TransactionFiltersEnum.senderShard, { checkIsInteger: true }) ??
    getParam('sendershard', { checkIsInteger: true });

  const receiverShard =
    getParam(TransactionFiltersEnum.receiverShard, { checkIsInteger: true }) ??
    getParam('receivershard', { checkIsInteger: true });

  const filters = {
    senderShard,
    receiverShard,
    sender: getParam(TransactionFiltersEnum.sender),
    receiver: getParam(TransactionFiltersEnum.receiver),
    before: getParam(TransactionFiltersEnum.before, { checkIsInteger: true }),
    after: getParam(TransactionFiltersEnum.after, { checkIsInteger: true }),
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
