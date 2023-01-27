import React, { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { networks } from 'config';
import { useIsMainnet } from 'hooks';

// eslint-disable-next-line import/order
import { AxiosInterceptor } from 'components';
import { activeNetworkSelector } from 'redux/selectors';
import { store, persistor } from 'redux/store';
import { wrappedRoutes, validatorsRoutes } from 'routes';
import { NetworkType } from 'types';

import { Layout } from './pages/Layout';
import { PageNotFound } from './pages/PageNotFound';

import './assets/sass/theme.scss';

export const FilteredRoutes = ({
  routes
}: {
  routes: { path: string; Component: React.ComponentClass }[];
}) => {
  const { id: activeNetworkId, adapter } = useSelector(activeNetworkSelector);
  const isMainnet = useIsMainnet();

  const restrictedRoutes = routes.filter(({ path }) => {
    if (
      (!isMainnet &&
        [
          validatorsRoutes.identities,
          validatorsRoutes.identityDetails
        ].includes(path)) ||
      (adapter === 'elastic' && Object.values(validatorsRoutes).includes(path))
    ) {
      return false;
    }
    return true;
  });

  return useMemo(
    () => (
      <Routes>
        {networks.map((network: NetworkType, i: number) => {
          return restrictedRoutes.map((route, i) => {
            return (
              <Route
                path={`/${network.id}${route.path}`}
                key={network.id + route.path}
                element={<route.Component />}
              />
            );
          });
        })}
        <Route
          path={`${activeNetworkId}/:any`}
          key={activeNetworkId + '404'}
          element={<PageNotFound />}
        />
        ,
        {restrictedRoutes.map((route, i) => {
          return (
            <Route
              path={route.path}
              key={route.path + i}
              element={<route.Component />}
            />
          );
        })}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [networks, activeNetworkId]
  );
};

export const ProviderApp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AxiosInterceptor>
          <Layout>
            <FilteredRoutes routes={wrappedRoutes} />
          </Layout>
        </AxiosInterceptor>
      </PersistGate>
    </Provider>
  );
};

export const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ProviderApp />
    </BrowserRouter>
  );
};
