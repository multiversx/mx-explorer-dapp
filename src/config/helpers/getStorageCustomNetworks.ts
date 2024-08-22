import { LOCAL_STORAGE_CUSTOM_NETWORK } from 'appConstants';
import { storage } from 'helpers/storage';
import { NetworkAdapterEnum, NetworkType } from 'types';

export const getStorageCustomNetworks = (): NetworkType[] => {
  try {
    const storageNetworks = storage.getFromLocal(LOCAL_STORAGE_CUSTOM_NETWORK);
    const parsedNetworks = JSON.parse(storageNetworks);

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

  return [];
};
