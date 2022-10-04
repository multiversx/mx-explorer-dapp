import { useLocation } from 'react-router-dom';
import { stringIsInteger } from 'helpers';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';

const checkValue = (value: string) => (stringIsInteger(value) ? parseInt(value) : undefined);

const checkStatus = (status: string) =>
  Object.keys(txStatus).includes(status.toLowerCase()) ? status.toLowerCase() : undefined;

export default function useURLSearchParams() {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  const shard = query.get('shard') ? String(query.get('shard')) : '';
  const method = query.get('function') ? String(query.get('function')) : '';
  const before = query.get('before') ? String(query.get('before')) : '';
  const after = query.get('after') ? String(query.get('after')) : '';
  const status = query.get('status') ? String(query.get('status')) : '';

  let senderShard = query.get('senderShard') ? String(query.get('senderShard')) : '';
  senderShard = query.get('sendershard') ? String(query.get('sendershard')) : senderShard;
  let receiverShard = query.get('receiverShard') ? String(query.get('receiverShard')) : '';
  receiverShard = query.get('receivershard') ? String(query.get('receivershard')) : receiverShard;

  return {
    page: checkValue(page),
    shard: checkValue(shard),
    senderShard: checkValue(senderShard),
    receiverShard: checkValue(receiverShard),
    before: checkValue(before),
    after: checkValue(after),
    status: checkStatus(status),
    method,
  };
}
