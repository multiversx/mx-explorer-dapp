import { useSelector } from 'react-redux';

import { SHARE_PREFIX } from 'config';
import { capitalize } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetExplorerTitle = () => {
  const { id } = useSelector(activeNetworkSelector);
  const explorerTitle =
    id !== 'mainnet' && SHARE_PREFIX
      ? `${capitalize(SHARE_PREFIX)} Explorer`
      : 'Explorer';

  return explorerTitle;
};
