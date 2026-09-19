import { DEFAULT_HRP, REFRESH_RATE } from 'appConstants';
import { NetworkAdapterEnum, NetworkType } from 'types';

export const getInternalNetworks = (): NetworkType[] => {
  const internalNetworks = import.meta.env.VITE_APP_INTERNAL_NETWORKS;

  if (internalNetworks) {
    try {
      const decodedNetworks = atob(String(internalNetworks));

      const parsedNetworks = JSON.parse(decodedNetworks);
      if (parsedNetworks && parsedNetworks.length > 0) {
        return parsedNetworks.map((network: NetworkType) => {
          return {
            ...network,
            ...(!network?.adapter ? { adapter: NetworkAdapterEnum.api } : {}),
            ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {}),
            ...(!network?.chainId ? { chainId: 'T' } : {}),
            ...(!network?.hrp ? { hrp: DEFAULT_HRP } : {}),
            ...(!network?.refreshRate ? { refreshRate: REFRESH_RATE } : {})
          };
        });
      }
    } catch {
      return [];
    }
  }

  return [];
};
