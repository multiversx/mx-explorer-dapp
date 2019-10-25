import React from 'react';
import { hot } from 'react-hot-loader/root';
import Home from './components/Home';
import Layout from './components/Layout';
import Transactions from './components/Transactions';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/transactions">
            <Transactions />
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
  );
};

function Users() {
  return <h2>Users</h2>;
}

export default hot(App);
