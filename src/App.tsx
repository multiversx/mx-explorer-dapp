import * as Sentry from '@sentry/browser';
import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PageNotFoud from './components/PageNotFoud';
import { GlobalProvider, useGlobalState } from './context';
import { ConfigType, TestnetType } from './context/state';
import { buildInitialConfig } from './context/config';
import buildConfig from './context/getAsyncConfig';
import routes from './routes';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://8ed464acd35d44a6a582ff624dd3c38d@sentry.io/485879' });
}
export const Routes = ({
  routes,
}: {
  routes: { path: string; component: React.ComponentClass }[];
}) => {
  const {
    config: { testnets },
    activeTestnet,
  } = useGlobalState();

  return useMemo(
    () => (
      <React.Suspense fallback={<span>Loading...</span>}>
        <Switch>
          {testnets.map((testnet: TestnetType, i: number) => {
            const validatorsDisabled = testnet.validators === false;
            return routes.map((route, i) => {
              if (route.path.includes('validators') && validatorsDisabled) {
                return null;
              }
              return (
                <Route
                  path={`/${testnet.id}${route.path}`}
                  key={testnet.id + route.path}
                  exact={true}
                  component={route.component}
                />
              );
            });
          })}
          <Route
            path={`${activeTestnet.id}/:any`}
            key={activeTestnet.id + '404'}
            exact={true}
            component={PageNotFoud}
          />
          ,
          {routes.map((route, i) => {
            const validatorsDisabled = activeTestnet.validators === false;
            if (route.path.includes('validators') && validatorsDisabled) {
              return null;
            }
            return (
              <Route
                path={route.path}
                key={route.path + i}
                component={route.component}
                exact={true}
              />
            );
          })}
          <Route component={PageNotFoud} />
        </Switch>
      </React.Suspense>
    ),
    [testnets, activeTestnet, routes]
  );
};

export const App = ({ optionalConfig }: { optionalConfig?: ConfigType }) => {
  const [config, setConfig] = React.useState<ConfigType>(optionalConfig as any);

  const fetchAsyncConfig = () => {
    if (optionalConfig === undefined) {
      buildConfig().then((data: any) => {
        const config = data as ConfigType;
        setConfig(config);
      });
    }
  };

  React.useEffect(fetchAsyncConfig, []);

  return config !== undefined ? (
    <GlobalProvider
      optionalConfig={optionalConfig}
      config={config !== undefined ? config : buildInitialConfig()}
    >
      <Layout>
        <Routes routes={routes} />
      </Layout>
    </GlobalProvider>
  ) : null;
};

const RoutedApp = () => {
  const DevWrapper = ({ children }: any) => <>{children}</>;
  const ProdErrorBoundary = process.env.NODE_ENV === 'production' ? ErrorBoundary : DevWrapper;

  return (
    <ProdErrorBoundary>
      <Router>
        <App />
      </Router>
    </ProdErrorBoundary>
  );
};

export default hot(RoutedApp);
