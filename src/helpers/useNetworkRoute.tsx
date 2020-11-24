import { useGlobalState } from 'context';

const useNetworkRoute = () => {
  const { activeNetworkId } = useGlobalState();
  return (to: string) => (activeNetworkId ? `/${activeNetworkId}${to}` : to);
};

export default useNetworkRoute;
