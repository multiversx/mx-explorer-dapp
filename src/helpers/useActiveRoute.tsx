import { useMatchPath, useNetworkRoute } from 'helpers';

export const useActiveRoute = () => {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();

  return (path: string) => matchPath(networkRoute(path)) !== null;
};
