import { NetworkType, NetworkUrlType } from 'types/network.types';

export const getInternalLinks = (networks: NetworkType[]): NetworkUrlType[] => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.VITE_APP_SHARE_PREFIX === 'internal-'
  ) {
    const internalLinks = networks
      .filter(({ id, name, isCustom }) => id && name && !isCustom)
      .map(({ id = '', name = '' }) => {
        return {
          id,
          name,
          url: `https://${id}.${process.env.VITE_APP_SHARE_PREFIX}explorer.multiversx.com`
        };
      });

    if (internalLinks.length > 0) {
      return internalLinks;
    }
  }

  return [];
};
