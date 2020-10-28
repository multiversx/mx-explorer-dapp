import { useLocation } from 'react-router-dom';

export default function useURLSearchParams() {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  const shard = query.get('shard') ? String(query.get('shard')) : '';
  return {
    page,
    shard,
  };
}
