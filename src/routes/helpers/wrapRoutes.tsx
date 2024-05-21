import { RouteObject } from 'react-router-dom';
import { ErrorElement } from 'components/ErrorElement';
import { withPageTitle } from '../helpers/withPageTitle';

import { TitledRouteObject } from '../routes';

export const wrapRoutes = (routes: TitledRouteObject[]): RouteObject[] =>
  routes.map((route) => {
    if (route.path) {
      if (route.children && route.children.length > 0) {
        wrapRoutes(route.children);
      }

      route.Component = route.Component
        ? withPageTitle(
            route.title ?? '',
            route.Component,
            route?.preventScroll
          )
        : route.Component;

      delete route['title'];

      route.errorElement = <ErrorElement />;

      return route;
    }

    route.errorElement = <ErrorElement />;

    return route;
  });
