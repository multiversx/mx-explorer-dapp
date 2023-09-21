import { networks } from 'config';

export const useGetSubdomainNetwork = () => {
  const subdomain = window?.location?.hostname
    ? window.location.hostname.split('.')[0].replaceAll('-explorer', '')
    : '';
  const defaultPrefix = process.env.VITE_APP_SHARE_PREFIX
    ? String(process.env.VITE_APP_SHARE_PREFIX).replace('-', '')
    : '';
  const allNetworkIds = networks.map((network) => network.id);

  if (allNetworkIds.length > 1) {
    if (
      allNetworkIds.includes(subdomain) &&
      defaultPrefix &&
      !allNetworkIds.includes(defaultPrefix)
    ) {
      const foundSubdomainNetwork = networks.find(
        ({ id }) => id === subdomain || id?.endsWith(subdomain)
      );

      return foundSubdomainNetwork;
    }
  }

  return;
};
