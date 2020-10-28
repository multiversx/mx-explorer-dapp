import { useLocation } from 'react-router-dom';
import { isValidInteger } from 'helpers';

const checkValue = (value: string) => (isValidInteger(value) ? parseInt(value) : undefined);

export default function useURLSearchParams() {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  const shard = query.get('shard') ? String(query.get('shard')) : '';
  const senderShard = query.get('senderShard') ? String(query.get('senderShard')) : '';
  const receiverShard = query.get('receiverShard') ? String(query.get('receiverShard')) : '';

  return {
    page: checkValue(page),
    shard: checkValue(shard),
    senderShard: checkValue(senderShard),
    receiverShard: checkValue(receiverShard),
  };
}
