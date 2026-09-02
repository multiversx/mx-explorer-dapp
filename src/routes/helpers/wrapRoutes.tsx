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

      const title = route.title ?? '';
      const { preventScroll, lazyComponent } = route;

      if (lazyComponent) {
        // resolved once by react-router on first match, then cached
        route.lazy = async () => ({
          Component: withPageTitle(title, await lazyComponent(), preventScroll)
        });

        delete route['lazyComponent'];
      } else {
        route.Component = route.Component
          ? withPageTitle(title, route.Component, preventScroll)
          : route.Component;
      }

      delete route['title'];

      route.errorElement = <ErrorElement />;

      return route;
    }

    route.errorElement = <ErrorElement />;

    return route;
  });
