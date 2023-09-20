import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { networks } from 'config';
import { useGetSubdomainNetwork } from 'hooks';
import { defaultNetworkSelector } from 'redux/selectors';

export const useGetURLNetwork = () => {
  const defaultNetwork = useSelector(defaultNetworkSelector);
  const subdomainNetwork = useGetSubdomainNetwork();

  const { pathname } = useLocation();
  const locationArray = pathname.substring(1).split('/');
  const networkId = locationArray[0];
  const allNetworkIds = networks.map((network) => network.id);

  if (allNetworkIds.length > 1) {
    if (allNetworkIds.includes(networkId)) {
      const foundNetwork = networks.find(({ id }) => id === networkId);

      return foundNetwork;
    }

    if (subdomainNetwork) {
      return subdomainNetwork;
    }
  }

  return defaultNetwork;
};
