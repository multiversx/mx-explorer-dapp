import { matchPath, useLocation } from 'react-router-dom';

import { useNetworkRoute } from 'hooks';

export const useMatchPath = () => {
  const networkRoute = useNetworkRoute();
  const { pathname } = useLocation();

  return (path: string) => matchPath(networkRoute(path), pathname) !== null;
};
