import { useLocation, matchPath } from 'react-router-dom';

import { useNetworkRoute } from 'hooks';
import { wrappedRoutes } from 'routes';

export const useGetHash = () => {
  const networkRoute = useNetworkRoute();
  const { pathname } = useLocation();

  const currentRoute = Object.values(wrappedRoutes).find(({ path }) => {
    const match = matchPath(networkRoute(path), pathname);

    return match?.params?.hash;
  });

  if (currentRoute) {
    const match = matchPath(networkRoute(currentRoute.path), pathname);

    if (match) {
      return match.params.hash;
    }
  }

  return '';
};
