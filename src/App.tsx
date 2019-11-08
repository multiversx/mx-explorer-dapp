import React from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import Layout from './components/Layout';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PageNotFoud from './components/PageNotFoud';
import routes from './routes';

const Routes: React.FC = () => {
  const { config } = useGlobalState();
  return (
    <Switch>
      {config.testnets.map((testnet, i) => (
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
  );
};

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Layout>
        <Routes />
      </Layout>
    </GlobalProvider>
  );
};

const RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

function Users() {
  return <>ASD</>;
}

export default hot(RoutedApp);
