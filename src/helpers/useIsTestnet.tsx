import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdType } from 'types';

export const useIsTestnet = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return activeNetworkId === NetworkIdType.testnet;
};
