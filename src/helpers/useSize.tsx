import { useSelector } from 'react-redux';
import { useURLSearchParams } from 'helpers';

import { interfaceSelector } from 'redux/selectors';

export const useSize = () => {
  const {
    refresh: { timestamp }
  } = useSelector(interfaceSelector);

  const { page } = useURLSearchParams();
  const size = !isNaN(page!) ? parseInt(String(page)) : 1;
  const firstPageTicker = size === 1 ? timestamp : 0;

  return {
    size,
    firstPageTicker
  };
};
