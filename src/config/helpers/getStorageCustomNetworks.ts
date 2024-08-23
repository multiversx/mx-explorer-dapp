import { CUSTOM_NETWORK_ID } from 'appConstants';
import { storage } from 'helpers/storage';
import { NetworkAdapterEnum, NetworkType } from 'types';

export const getStorageCustomNetworks = (): NetworkType[] => {
  try {
    const storageNetworks = storage.getFromLocal(CUSTOM_NETWORK_ID);
    const parsedNetworks = JSON.parse(storageNetworks);

    if (parsedNetworks && parsedNetworks.length > 0) {
      return parsedNetworks.map((network: NetworkType) => {
        return {
          ...network,
          ...(!network?.adapter ? { adapter: NetworkAdapterEnum.api } : {}),
          ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {}),
          ...(!network?.chainId ? { chainId: 'T' } : {}),
          isCustom: true
        };
      });
    }
  } catch {
    return [];
  }

  return [];
};
