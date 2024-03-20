import { useSelector } from 'react-redux';

import { getSubdomainNetwork } from 'helpers';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

export const useNetworkRoute = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { subdomainNetwork } = getSubdomainNetwork();

  return (to: string) =>
    activeNetworkId &&
    activeNetworkId !== defaultNetworkId &&
    !to.includes(activeNetworkId) &&
    !subdomainNetwork
      ? `/${activeNetworkId}${to}`
      : to;
};
