import { networks } from 'config';

const getSubdomain = (hostname: string) => {
  const hostnameArray = hostname.split('.');
  const allNetworkIds = networks.map((network) => network.id);
  const defaultPrefix = process.env.VITE_APP_SHARE_PREFIX
    ? String(process.env.VITE_APP_SHARE_PREFIX).replace('-', '')
    : '';

  const isSubSubdomain =
    Boolean(defaultPrefix) &&
    hostnameArray?.[1] === `${defaultPrefix}-explorer`;

  const foundSubdomain = hostnameArray.find(
    (host) =>
      allNetworkIds.includes(host.toLowerCase().replaceAll('-explorer', '')) &&
      !allNetworkIds.includes(defaultPrefix)
  );

  return {
    subdomain:
      allNetworkIds.length > 1 && foundSubdomain ? foundSubdomain : undefined,
    isSubSubdomain: isSubSubdomain
  };
};

export const getSubdomainNetwork = () => {
  const { subdomain, isSubSubdomain } = window?.location?.hostname
    ? getSubdomain(window.location.hostname)
    : { subdomain: undefined, isSubSubdomain: false };

  const foundSubdomainNetwork = networks.find(
    ({ id }) => id === subdomain || (subdomain && id?.endsWith(subdomain))
  );

  return {
    subdomainNetwork: foundSubdomainNetwork,
    isSubSubdomain
  };
};
