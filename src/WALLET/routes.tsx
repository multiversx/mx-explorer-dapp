import React from 'react';
import Home from './Home';
import Login from './Login';
import { withTestnetReady, withPageTitle } from 'sharedComponents';

type RouteType = {
  path: string;
  title: string;
  component: any;
};

const routes: RouteType[] = [
  {
    path: '/',
    title: '',
    component: Home,
  },
  {
    path: '/login',
    title: '',
    component: Login,
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
