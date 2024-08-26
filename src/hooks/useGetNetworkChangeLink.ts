import { useSelector } from 'react-redux';

import { getSubdomainNetwork } from 'helpers';
import { defaultNetworkSelector } from 'redux/selectors';

export const useGetNetworkChangeLink = () => {
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { isSubSubdomain } = getSubdomainNetwork();

  const getNetworkChangeLink = ({ networkId }: { networkId?: string }) => {
    if (isSubSubdomain && window?.location?.hostname) {
      const [_omit, ...rest] = window.location.hostname.split('.');
      return `https://${[networkId, ...rest].join('.')}`;
    }

    return networkId === defaultNetworkId ? '/' : `/${networkId}`;
  };

  return getNetworkChangeLink;
};
