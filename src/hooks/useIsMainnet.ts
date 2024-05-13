import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdType } from 'types';

export const useIsMainnet = () => {
  const { id: activeNetworkId, chainId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdType.mainnet || chainId === '1';
};
