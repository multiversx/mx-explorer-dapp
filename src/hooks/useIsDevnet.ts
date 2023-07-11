import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdType } from 'types';

export const useIsDevnet = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdType.devnet;
};
