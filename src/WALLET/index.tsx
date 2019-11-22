import React from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider } from 'context';
import { WalletProvider, useWalletDispatch } from './context';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout';
import { Routes } from '../App';
import routes from './routes';
import Navbar from './Navbar';

const SessionStarter = () => {
  const dispatch = useWalletDispatch();

  const init = () => {
    dispatch({ type: 'initSession' });
    return () => {
      dispatch({ type: 'logout' });
    };
  };

  React.useEffect(init, []);
  return null;
};

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <WalletProvider>
        <SessionStarter />
        <Layout navbar={<Navbar />}>
          <Routes routes={routes} />
        </Layout>
      </WalletProvider>
    </GlobalProvider>
  );
};

const RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

export default hot(RoutedApp);
