import moment from 'moment';

import { CUSTOM_NETWORK_ID, DEFAULT_HRP, REFRESH_RATE } from 'appConstants';
import { hasExtraNetworks } from 'config';
import { cookie } from 'helpers/cookie';
import { storage } from 'helpers/storage';
import { NetworkAdapterEnum, NetworkType } from 'types';

export const getStorageCustomNetworks = (): NetworkType[] => {
  if (!hasExtraNetworks) {
    return [];
  }

  try {
    const cookieNetworks = cookie.getFromCookies(CUSTOM_NETWORK_ID);

    // change custom network across sub-subdomains
    if (cookieNetworks) {
      try {
        const parsedCookieNetworks = JSON.parse(cookieNetworks);
        if (parsedCookieNetworks && parsedCookieNetworks.length > 0) {
          const in30Days = new Date(moment().add(30, 'days').toDate());
          storage.saveToLocal({
            key: CUSTOM_NETWORK_ID,
            data: JSON.stringify(parsedCookieNetworks),
            expirationDate: in30Days
          });

          cookie.removeFromCookies(CUSTOM_NETWORK_ID);
        }
      } catch {}
    }

    const storageNetworks = storage.getFromLocal(CUSTOM_NETWORK_ID);
    const parsedNetworks = JSON.parse(storageNetworks);

    if (parsedNetworks && parsedNetworks.length > 0) {
      return parsedNetworks.map((network: NetworkType) => {
        return {
          ...network,
          ...(!network?.adapter ? { adapter: NetworkAdapterEnum.api } : {}),
          ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {}),
          ...(!network?.chainId ? { chainId: 'T' } : {}),
          ...(!network?.hrp ? { hrp: DEFAULT_HRP } : {}),
          ...(!network?.refreshRate ? { refreshRate: REFRESH_RATE } : {}),
          isCustom: true
        };
      });
    }
  } catch {
    return [];
  }

  return [];
};
