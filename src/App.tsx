import React from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import Home from './components/Home';
import Layout from './components/Layout';
import Transactions from './components/Transactions';
import Blocks from './components/Blocks';
import TransactionDetails from './components/TransactionDetails';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const routes = [
  {
    path: '/transactions/page/:page',
    component: Transactions,
  },
  {
    path: '/transactions/:transactionId',
    component: TransactionDetails,
  },
  {
    path: '/blocks/page/:page',
    component: Blocks,
  },
  {
    path: '/blocks/:transactionId',
    component: TransactionDetails,
  },
];

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
                component={route.component}
              />
            ))
          }
        />
      ))}
      {routes.map((route, i) => (
        <Route path={route.path} key={route.path + i} component={route.component} />
      ))}
      <Route path="/blocks">
        <Users />
      </Route>
      <Route path="/">
        <Home />
      </Route>
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
