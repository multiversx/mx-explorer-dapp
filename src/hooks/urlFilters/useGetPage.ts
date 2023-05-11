import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { refreshSelector } from 'redux/selectors/refresh';

export const useGetPage = () => {
  const { timestamp } = useSelector(refreshSelector);

  const [searchParams] = useSearchParams();
  const { page: urlPage } = Object.fromEntries(searchParams);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const page = stringIsInteger(urlPage) ? parseInt(urlPage) : 1;
  const firstPageRefreshTrigger = page === 1 ? timestamp : 0;

  return {
    page,
    firstPageRefreshTrigger
  };
};
