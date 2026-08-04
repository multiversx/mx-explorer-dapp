import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE } from 'appConstants';
import { isCursorPage } from 'helpers';
import { stringIsInteger } from 'lib';
import { refreshSelector } from 'redux/selectors';

export const useGetPage = () => {
  const { timestamp } = useSelector(refreshSelector);

  const [searchParams] = useSearchParams();
  const {
    page: urlPage,
    size: urlSize,
    searchAfter: urlSearchAfter
  } = Object.fromEntries(searchParams);

  const page = stringIsInteger(urlPage) ? parseInt(urlPage) : 1;
  const size = stringIsInteger(urlSize) ? parseInt(urlSize) : PAGE_SIZE;

  const searchAfter = isCursorPage({ page, size }) ? urlSearchAfter : undefined;

  const firstPageRefreshTrigger = page === 1 ? timestamp : 0;

  return {
    page,
    size,
    searchAfter,
    firstPageRefreshTrigger
  };
};
