import React, { memo } from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import { TestnetType } from './context/state';
import Layout from './components/Layout';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PageNotFoud from './components/PageNotFoud';
import routes from './routes';

const Routes = memo(({ testnets }: { testnets: TestnetType[] }) => {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <Switch>
        {testnets.map((testnet, i) => (
          <Route
            path={`/${testnet.id}`}
            key={testnet.id + i}
            render={({ match: { url } }) =>
              routes.map(route => (
                <Route
                  path={`${url}${route.path}`}
                  key={testnet.id + route.path}
                  exact
                  component={route.component}
                />
              ))
            }
          />
        ))}
        {routes.map((route, i) => (
          <Route path={route.path} key={route.path + i} component={route.component} exact />
        ))}
        <Route component={PageNotFoud} />
      </Switch>
    </React.Suspense>
  );
});

const RoutesProvider = () => {
  const {
    config: { testnets },
  } = useGlobalState();
  return <Routes testnets={testnets} />;
};

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Layout>
        <RoutesProvider />
      </Layout>
    </GlobalProvider>
  );
};

const RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

export default hot(RoutedApp);
