import { useSearchParams } from 'react-router-dom';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { stringIsInteger } from 'helpers';

const checkValue = (value: string) =>
  stringIsInteger(value) ? parseInt(value) : undefined;

const checkStatus = (status: string) =>
  Object.keys(txStatus).includes(status.toLowerCase())
    ? status.toLowerCase()
    : undefined;

export const useURLSearchParams = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') ? String(searchParams.get('page')) : '';
  const shard = searchParams.get('shard')
    ? String(searchParams.get('shard'))
    : '';
  const method = searchParams.get('function')
    ? String(searchParams.get('function'))
    : '';
  const before = searchParams.get('before')
    ? String(searchParams.get('before'))
    : '';
  const after = searchParams.get('after')
    ? String(searchParams.get('after'))
    : '';
  const status = searchParams.get('status')
    ? String(searchParams.get('status'))
    : '';
  const miniBlockHash = searchParams.get('miniBlockHash')
    ? String(searchParams.get('miniBlockHash'))
    : '';
  const search = searchParams.get('search')
    ? String(searchParams.get('search'))
    : '';
  const sender = searchParams.get('sender')
    ? String(searchParams.get('sender'))
    : '';
  const receiver = searchParams.get('receiver')
    ? String(searchParams.get('receiver'))
    : '';

  let senderShard = searchParams.get('senderShard')
    ? String(searchParams.get('senderShard'))
    : '';
  senderShard = searchParams.get('sendershard')
    ? String(searchParams.get('sendershard'))
    : senderShard;
  let receiverShard = searchParams.get('receiverShard')
    ? String(searchParams.get('receiverShard'))
    : '';
  receiverShard = searchParams.get('receivershard')
    ? String(searchParams.get('receivershard'))
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
