import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdEnum } from 'types';

export const useIsMainnet = () => {
  const { id: activeNetworkId, chainId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdEnum.mainnet || chainId === '1';
};
