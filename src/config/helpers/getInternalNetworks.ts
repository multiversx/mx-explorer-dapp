import { NetworkAdapterEnum, NetworkType } from 'types';

export const getInternalNetworks = (): NetworkType[] => {
  if (process.env.VITE_APP_INTERNAL_NETWORKS) {
    try {
      const decodedNetworks = atob(
        String(process.env.VITE_APP_INTERNAL_NETWORKS)
      );

      const parsedNetworks = JSON.parse(decodedNetworks);
      if (parsedNetworks && parsedNetworks.length > 0) {
        return parsedNetworks.map((network: NetworkType) => {
          return {
            ...network,
            ...(!network?.adapter ? { adapter: NetworkAdapterEnum.api } : {}),
            ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {}),
            ...(!network?.chainId ? { chainId: 'T' } : {})
          };
        });
      }
    } catch {
      return [];
    }
  }

  return [];
};
