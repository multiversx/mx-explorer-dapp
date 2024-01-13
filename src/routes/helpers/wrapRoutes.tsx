import { RouteObject } from 'react-router-dom';
import { ErrorElement } from 'components/ErrorElement';
import { capitalize } from 'helpers';
import { withPageTitle } from '../helpers/withPageTitle';

import { TitledRouteObject } from '../routes';

export const wrapRoutes = (routes: TitledRouteObject[]): RouteObject[] =>
  routes.map((route) => {
    if (route.path) {
      const customLinkPrefix = process.env.VITE_APP_SHARE_PREFIX
        ? `${capitalize(
            String(process.env.VITE_APP_SHARE_PREFIX).replace('-', ' ')
          )} `
        : '';
      const title = route.title
        ? `${route.title} • MultiversX ${customLinkPrefix}Explorer`
        : `MultiversX ${customLinkPrefix}Explorer`;

      if (route.children && route.children.length > 0) {
        wrapRoutes(route.children);
      }

      route.Component = route.Component
        ? withPageTitle(title, route.Component, route?.preventScroll)
        : route.Component;

      delete route['title'];

      route.errorElement = <ErrorElement />;

      return route;
    }

    route.errorElement = <ErrorElement />;

    return route;
  });
