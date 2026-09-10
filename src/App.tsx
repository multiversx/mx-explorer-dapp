import { Provider } from 'react-redux';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { Interceptor } from 'interceptors';
import { store } from 'redux/store';
import { wrappedRoutes } from 'routes';

import './assets/scss/theme.scss';

export const ProviderApp = () => {
  return (
    <Provider store={store}>
      <Interceptor>
        <Outlet />
      </Interceptor>
    </Provider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProviderApp />,
    children: wrappedRoutes
  }
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
