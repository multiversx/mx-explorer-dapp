import React from 'react';
import { withTestnetReady, withPageTitle } from 'sharedComponents';

type RouteType = {
  path: string;
  title: string;
  component: any;
};

const Home = () => <h1>HOME</h1>;

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./components/Validators')),

const routes: RouteType[] = [
  {
    path: '/',
    title: '',
    component: Home,
  },
];

const wrappedRoutes = () =>
  routes.map(route => {
    const title = route.title ? `${route.title} • Elrond Explorer` : 'Elrond Explorer';
    return {
      path: route.path,
      component: (withPageTitle(
        title,
        withTestnetReady(route.component)
      ) as any) as React.ComponentClass<{}, any>,
    };
  });

export default wrappedRoutes();
