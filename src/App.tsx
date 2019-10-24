import React from 'react';
import { hot } from 'react-hot-loader/root';
import Home from './components/Home';
import Layout from './components/Layout';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/wallet">
            <About />
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

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default hot(App);
