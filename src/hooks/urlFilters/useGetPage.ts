import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE } from 'appConstants';
import { refreshSelector } from 'redux/selectors/refresh';

export const useGetPage = () => {
  const { timestamp } = useSelector(refreshSelector);

  const [searchParams] = useSearchParams();
  const { page: urlPage, size: urlSize } = Object.fromEntries(searchParams);

  const page = stringIsInteger(urlPage) ? parseInt(urlPage) : 1;
  const size = stringIsInteger(urlSize) ? parseInt(urlSize) : PAGE_SIZE;

  const firstPageRefreshTrigger = page === 1 ? timestamp : 0;

  return {
    page,
    size,
    firstPageRefreshTrigger
  };
};
