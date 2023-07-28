import { RouteObject } from 'react-router-dom';
import { withPageTitle } from '../helpers/withPageTitle';

import { TitledRouteObject } from '../routes';

export const wrapRoutes = (routes: TitledRouteObject[]): RouteObject[] =>
  routes.map((route) => {
    if (route.path) {
      const title = route.title
        ? `${route.title} • MultiversX Explorer`
        : 'MultiversX Explorer';

      if (route.children && route.children.length > 0) {
        wrapRoutes(route.children);
      }

      route.Component = route.Component
        ? withPageTitle(title, route.Component, route?.preventScroll)
        : route.Component;

      delete route['title'];

      return route;
    }

    return route;
  });
