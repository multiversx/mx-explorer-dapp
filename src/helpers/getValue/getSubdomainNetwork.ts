import { networks, SHARE_PREFIX } from 'config';

const getSubdomain = (hostname: string) => {
  const hostnameArray = hostname.split('.');
  const allNetworkIds = networks.map((network) => network.id);
  const defaultPrefix = SHARE_PREFIX.toLowerCase();
  const defaultSuffix = '-explorer';

  const isSubSubdomain =
    Boolean(defaultPrefix) &&
    hostnameArray?.[1] === `${defaultPrefix}${defaultSuffix}`;

  const foundSubdomain = hostnameArray.find(
    (host) =>
      allNetworkIds.includes(
        host.toLowerCase().replaceAll(defaultSuffix, '')
      ) && !allNetworkIds.includes(defaultPrefix)
  );

  return {
    subdomain:
      allNetworkIds.length > 1 && foundSubdomain ? foundSubdomain : undefined,
    isSubSubdomain: isSubSubdomain
  };
};

export const getSubdomainNetwork = () => {
  if (!window?.location?.hostname) {
    return { subdomain: undefined, isSubSubdomain: false };
  }
  const { subdomain, isSubSubdomain } = getSubdomain(window.location.hostname);
  const foundSubdomainNetwork = networks.find(
    ({ id }) => id === subdomain || (subdomain && id?.endsWith(subdomain))
  );

  return {
    subdomainNetwork: foundSubdomainNetwork,
    isSubSubdomain
  };
};
