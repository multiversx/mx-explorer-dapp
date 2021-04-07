import { useMatchPath, useNetworkRoute } from 'helpers';

const useActiveRoute = () => {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();

  return (path: string) => matchPath(networkRoute(path)) !== null;
};

export default useActiveRoute;
