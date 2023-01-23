import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useNetworkRoute = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  return (to: string) => (activeNetworkId ? `/${activeNetworkId}${to}` : to);
};
