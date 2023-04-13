import { useSelector } from 'react-redux';
import { useGetTransactionURLFilters } from 'hooks';

import { refreshSelector } from 'redux/selectors/refresh';

export const useGetPage = () => {
  const { timestamp } = useSelector(refreshSelector);

  const { page: urlPage } = useGetTransactionURLFilters();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const page = !isNaN(urlPage!) ? parseInt(String(urlPage)) : 1;
  const firstPageRefreshTrigger = page === 1 ? timestamp : 0;

  return {
    page,
    firstPageRefreshTrigger
  };
};
