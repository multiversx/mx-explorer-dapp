import { useSelector } from 'react-redux';
import {
  chainIdToEnvironment,
  EnvironmentsEnum,
  fallbackNetworkConfigurations
} from 'lib';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetEnvironment = () => {
  const { chainId, id: networkId } = useSelector(activeNetworkSelector);
  if (chainId) {
    const environmentForChainId = chainIdToEnvironment[chainId];
    if (environmentForChainId) {
      return environmentForChainId;
    }
  }

  if (networkId) {
    const hasFallbackConfig =
      fallbackNetworkConfigurations?.[networkId as EnvironmentsEnum];
    if (hasFallbackConfig) {
      return networkId as EnvironmentsEnum;
    }
  }

  return;
};
