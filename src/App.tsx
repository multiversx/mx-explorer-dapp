import React from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider } from './context';
import Home from './components/Home';
import Layout from './components/Layout';
import Transactions from './components/Transactions';
import TransactionDetails from './components/TransactionDetails';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Router>
        <Layout>
          <Switch>
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
        </Layout>
      </Router>
    </GlobalProvider>
  );
};

function Users() {
  return <>ASD</>;
}

export default hot(App);
