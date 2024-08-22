import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import { useGetSearch } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

export const useIsNativeTokenSearched = () => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { search } = useGetSearch();

  const isNativeTokenSearched = Boolean(
    search &&
      [
        'egld',
        'elrond',
        'multiversx',
        BRAND_NAME.toLowerCase(),
        (egldLabel ?? '').toLowerCase()
      ].includes(search.toLowerCase().trim())
  );

  return isNativeTokenSearched;
};
