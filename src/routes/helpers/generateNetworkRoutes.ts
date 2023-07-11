import { NetworkType } from 'types';
import { TitledRouteObject } from '../routes';

export function generateNetworkRoutes(
  routes: TitledRouteObject[],
  network: NetworkType
) {
  return routes.map((route) => {
    if (network.id && route.path) {
      if (!route.path.includes(network.id)) {
        route.path = `/${network.id}${
          route.path.startsWith('/') ? route.path : `/${route.path}`
        }`;
      }
      if (route.children && route.children.length > 0) {
        generateNetworkRoutes(route.children, network);
      }

      return route;
    }

    return route;
  });
}
