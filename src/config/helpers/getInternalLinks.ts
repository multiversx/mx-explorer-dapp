import { DEFAULT_HOSTNAME } from 'config';
import { NetworkType, NetworkUrlType } from 'types/network.types';

export const getInternalLinks = (networks: NetworkType[]): NetworkUrlType[] => {
  const isInternal =
    import.meta.env.NODE_ENV === 'production' &&
    import.meta.env.VITE_APP_SHARE_PREFIX === 'internal-';

  if (isInternal) {
    const internalLinks = networks
      .filter(({ id, name, isCustom }) => id && name && !isCustom)
      .map(({ id = '', name = '' }) => {
        return {
          id,
          name,
          url: `https://${id}.${
            import.meta.env.VITE_APP_SHARE_PREFIX
          }${DEFAULT_HOSTNAME}`
        };
      });

    if (internalLinks.length > 0) {
      return internalLinks;
    }
  }

  return [];
};
