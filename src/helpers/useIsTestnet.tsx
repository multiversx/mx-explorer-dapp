import { NetworkIdType } from 'types';
import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useIsTestnet = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdType.testnet;
};
