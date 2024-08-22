import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdEnum } from 'types';

export const useIsTestnet = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdEnum.testnet;
};
