import { useSelector } from 'react-redux';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

export const useNetworkRoute = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  return (to: string) =>
    activeNetworkId &&
    activeNetworkId !== defaultNetworkId &&
    !to.includes(activeNetworkId)
      ? `/${activeNetworkId}${to}`
      : to;
};
