import { useLocation } from 'react-router-dom';
import { stringIsInteger } from 'helpers';

const checkValue = (value: string) => (stringIsInteger(value) ? parseInt(value) : undefined);

export default function useURLSearchParams() {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  const shard = query.get('shard') ? String(query.get('shard')) : '';

  let senderShard = query.get('senderShard') ? String(query.get('senderShard')) : '';
  senderShard = query.get('sendershard') ? String(query.get('sendershard')) : senderShard;
  let receiverShard = query.get('receiverShard') ? String(query.get('receiverShard')) : '';
  receiverShard = query.get('receivershard') ? String(query.get('receivershard')) : receiverShard;

  return {
    page: checkValue(page),
    shard: checkValue(shard),
    senderShard: checkValue(senderShard),
    receiverShard: checkValue(receiverShard),
  };
}
