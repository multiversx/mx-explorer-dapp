import { useLocation } from 'react-router-dom';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { stringIsInteger } from 'helpers';

const checkValue = (value: string) =>
  stringIsInteger(value) ? parseInt(value) : undefined;

const checkStatus = (status: string) =>
  Object.keys(txStatus).includes(status.toLowerCase())
    ? status.toLowerCase()
    : undefined;

export const useURLSearchParams = () => {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  const shard = query.get('shard') ? String(query.get('shard')) : '';
  const method = query.get('function') ? String(query.get('function')) : '';
  const before = query.get('before') ? String(query.get('before')) : '';
  const after = query.get('after') ? String(query.get('after')) : '';
  const status = query.get('status') ? String(query.get('status')) : '';
  const miniBlockHash = query.get('miniBlockHash')
    ? String(query.get('miniBlockHash'))
    : '';
  const search = query.get('search') ? String(query.get('search')) : '';
  const sender = query.get('sender') ? String(query.get('sender')) : '';
  const receiver = query.get('receiver') ? String(query.get('receiver')) : '';

  let senderShard = query.get('senderShard')
    ? String(query.get('senderShard'))
    : '';
  senderShard = query.get('sendershard')
    ? String(query.get('sendershard'))
    : senderShard;
  let receiverShard = query.get('receiverShard')
    ? String(query.get('receiverShard'))
    : '';
  receiverShard = query.get('receivershard')
    ? String(query.get('receivershard'))
    : receiverShard;

  return {
    page: checkValue(page),
    shard: checkValue(shard),
    senderShard: checkValue(senderShard),
    receiverShard: checkValue(receiverShard),
    sender,
    receiver,
    before: checkValue(before),
    after: checkValue(after),
    status: checkStatus(status),
    miniBlockHash,
    search,
    method
  };
};
