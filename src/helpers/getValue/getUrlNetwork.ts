import { networks } from 'config';
import { getSubdomainNetwork } from 'helpers';

export const getUrlNetwork = () => {
  const { subdomainNetwork } = getSubdomainNetwork();
  const locationArray = location.pathname.substring(1).split('/');
  const networkId = locationArray[0];
  const allNetworkIds = networks.map((network) => network.id);

  if (!allNetworkIds || allNetworkIds.length === 0) {
    return;
  }

  if (allNetworkIds.includes(networkId)) {
    const foundNetwork = networks.find(({ id }) => id === networkId);

    return foundNetwork;
  }

  if (subdomainNetwork) {
    return subdomainNetwork;
  }
};
