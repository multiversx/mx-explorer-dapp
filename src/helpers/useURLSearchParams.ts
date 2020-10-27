import { useLocation } from 'react-router-dom';

export default function useURLSearchParams() {
  const query = new URLSearchParams(useLocation().search);
  const page = query.get('page') ? String(query.get('page')) : '';
  //   const page = !isNaN(parseInt(pageString)) ? parseInt(pageString) : '';
  return {
    page,
  };
}
