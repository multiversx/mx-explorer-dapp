import { useLocation } from 'react-router-dom';

import { useMatchPath, useNetworkRoute } from 'hooks';
import { collectionRoutes } from 'routes';

export const useActiveRoute = () => {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();
  const { pathname } = useLocation();

  return (path: string) => {
    const isNftOrSftRoute =
      (pathname === collectionRoutes.collectionsNft ||
        pathname === collectionRoutes.collectionsSft) &&
      networkRoute(path) === networkRoute(collectionRoutes.collectionDetails);

    if (isNftOrSftRoute) {
      return false;
    }

    return matchPath(networkRoute(path));
  };
};
