import { useMatchPath, useNetworkRoute } from 'hooks';

export const useActiveRoute = () => {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();

  return (path: string) => matchPath(networkRoute(path));
};
