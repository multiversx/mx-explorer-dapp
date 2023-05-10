import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// eslint-disable-next-line import/order
import { AxiosInterceptor } from 'components';
import { store, persistor } from 'redux/store';
import { wrappedRoutes } from 'routes';

import './assets/sass/theme.scss';

export const ProviderApp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AxiosInterceptor>
          {/* <ScrollRestoration
              getKey={(location) => {
                return location.pathname;
              }}
            /> */}

          <Outlet />
        </AxiosInterceptor>
      </PersistGate>
    </Provider>
  );
};

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ProviderApp />,
      children: wrappedRoutes
    }
  ]);

  return <RouterProvider router={router} />;
};
