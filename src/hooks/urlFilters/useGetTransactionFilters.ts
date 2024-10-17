import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSearchParams } from 'react-router-dom';

import { TransactionApiStatusEnum } from 'types';

const checkValue = (value: string) =>
  stringIsInteger(value) ? parseInt(value) : undefined;

const checkStatus = (status: string) =>
  status && Object.keys(TransactionApiStatusEnum).includes(status.toLowerCase())
    ? status.toLowerCase()
    : undefined;

export const useGetTransactionFilters = () => {
  const [searchParams] = useSearchParams();

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
  const sender = searchParams.get('sender')
    ? String(searchParams.get('sender'))
    : '';
  const receiver = searchParams.get('receiver')
    ? String(searchParams.get('receiver'))
    : '';
  const token = searchParams.get('token')
    ? String(searchParams.get('token'))
    : '';
  const hashes = searchParams.get('hashes')
    ? String(searchParams.get('hashes'))
    : '';
  const relayer = searchParams.get('relayer')
    ? String(searchParams.get('relayer'))
    : '';
  const isRelayed = searchParams.get('isRelayed')
    ? Boolean(searchParams.get('isRelayed'))
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
    shard: checkValue(shard),
    senderShard: checkValue(senderShard),
    receiverShard: checkValue(receiverShard),
    sender,
    receiver,
    before: checkValue(before),
    after: checkValue(after),
    status: checkStatus(status),
    miniBlockHash,
    method,
    hashes,
    token,
    relayer,
    isRelayed
  };
};
