import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdEnum } from 'types';

export const useIsDevnet = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdEnum.devnet;
};
