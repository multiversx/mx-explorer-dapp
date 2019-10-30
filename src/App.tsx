import React from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import Home from './components/Home';
import Layout from './components/Layout';
import Transactions from './components/Transactions';
import TransactionDetails from './components/TransactionDetails';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const Routes: React.FC = () => {
  const { config } = useGlobalState();

  return (
    <Switch>
      {config.testnets.map(testnet => [
        <Route
          path={`/${testnet.id}`}
          render={({ match: { url } }) => [
            <Route
              path={`${url}/transactions/page/:page`}
              key={testnet.id + 'transactions'}
              component={Transactions}
            />,
            <Route
              path={`${url}/transactions/:transactionId`}
              key={testnet.id + 'transactionDetails'}
              component={TransactionDetails}
            />,
          ]}
        />,
      ])}
      <Route path="/transactions/page/:page">
        <Transactions />
      </Route>
      <Route path="/transactions/:transactionId">
        <TransactionDetails />
      </Route>
      <Route path="/validators">
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
