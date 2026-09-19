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

const resultCache = new Map<
  string,
  ReturnType<typeof resolveSubdomainNetwork>
>();

const resolveSubdomainNetwork = (hostname: string) => {
  const { subdomain, isSubSubdomain } = getSubdomain(hostname);
  const foundSubdomainNetwork = networks.find(
    ({ id }) => id === subdomain || (subdomain && id?.endsWith(subdomain))
  );

  return {
    subdomainNetwork: foundSubdomainNetwork,
    isSubSubdomain
  };
};

export const getSubdomainNetwork = () => {
  const hostname = window?.location?.hostname;

  if (!hostname) {
    return { subdomainNetwork: undefined, isSubSubdomain: false };
  }

  const cached = resultCache.get(hostname);
  if (cached) {
    return cached;
  }

  const result = resolveSubdomainNetwork(hostname);
  resultCache.set(hostname, result);

  return result;
};
