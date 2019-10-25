import React from 'react';
import { hot } from 'react-hot-loader/root';
import { CountProvider } from './context/context';
import Home from './components/Home';
import Layout from './components/Layout';
import Transactions from './components/Transactions';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <CountProvider>
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
    </CountProvider>
  );
};

function Users() {
  return <>ASD</>;
}

export default hot(App);
