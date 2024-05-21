import { NetworkType } from 'types/network.types';

export const getStorageCustomNetworks = (): NetworkType[] => {
  try {
    const decodedNetworks = '';

    const parsedNetworks = JSON.parse(decodedNetworks);
    if (parsedNetworks && parsedNetworks.length > 0) {
      return parsedNetworks.map((network: NetworkType) => {
        return {
          ...network,
          ...(!network?.adapter ? { adapter: 'api' } : {}),
          ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {}),
          ...(!network?.chainId ? { chainId: 'T' } : {})
        };
      });
    }
  } catch {
    return [];
  }

  return [];
};
