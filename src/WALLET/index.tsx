import * as Sentry from '@sentry/browser';
import ErrorBoundary from 'components/ErrorBoundary';
import Layout from 'components/Layout';
import { GlobalProvider } from 'context';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from '../App';
import { useWalletDispatch, WalletProvider } from './context';
import Navbar from './Navbar';
import routes from './routes';

Sentry.init({ dsn: 'https://0483ca0493764b0cbfa1222a2614afbe@sentry.io/2234135' });

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
