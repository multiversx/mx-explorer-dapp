import { getEnvironmentForChainId } from '@multiversx/sdk-dapp/apiCalls/configuration/getEnvironmentForChainId';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';
import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetEnvironment = () => {
  const { chainId, id: networkId } = useSelector(activeNetworkSelector);
  if (chainId) {
    const environmentForChainId = getEnvironmentForChainId(chainId);
    if (environmentForChainId) {
      return environmentForChainId;
    }
  }

  if (networkId) {
    const hasFallbackConfig = fallbackNetworkConfigurations?.[networkId];
    if (hasFallbackConfig) {
      return networkId as EnvironmentsEnum;
    }
  }

  return;
};
