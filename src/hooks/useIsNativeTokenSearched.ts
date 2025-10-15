import { useSelector } from 'react-redux';

import { BRAND_NAME, NATIVE_TOKEN_IDENTIFIER } from 'appConstants';
import { isEgldToken } from 'helpers';
import { useGetSearch } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

export const useIsNativeTokenSearched = () => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { search } = useGetSearch();

  if (!search) {
    return false;
  }

  const searchedToken = search.toLowerCase().trim();

  if (
    isEgldToken(egldLabel) &&
    searchedToken === NATIVE_TOKEN_IDENTIFIER.toLowerCase()
  ) {
    return true;
  }

  const isNativeTokenSearched = [
    'egld',
    'elrond',
    'multiversx',
    BRAND_NAME.toLowerCase(),
    (egldLabel ?? '').toLowerCase()
  ].includes(searchedToken);

  return isNativeTokenSearched;
};
