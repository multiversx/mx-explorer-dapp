import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';

import { AxiosInterceptor } from 'interceptors';
import { store, persistor } from 'redux/store';
import { wrappedRoutes } from 'routes';

import './assets/scss/theme.scss';

export const ProviderApp = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <AxiosInterceptor>
            <Outlet />
          </AxiosInterceptor>
        </PersistGate>
      </Provider>
    </HelmetProvider>
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
