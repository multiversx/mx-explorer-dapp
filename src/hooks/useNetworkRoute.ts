import { useSelector } from 'react-redux';

import { useGetSubdomainNetwork } from 'hooks';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

export const useNetworkRoute = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const subdomainNetwork = useGetSubdomainNetwork();

  return (to: string) =>
    activeNetworkId &&
    activeNetworkId !== defaultNetworkId &&
    !to.includes(activeNetworkId) &&
    !subdomainNetwork
      ? `/${activeNetworkId}${to}`
      : to;
};
