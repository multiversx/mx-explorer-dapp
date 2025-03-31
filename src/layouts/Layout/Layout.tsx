import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useLocation, Outlet } from 'react-router-dom';

import { NotificationsBar, NetworkReady, MetaTags } from 'components';
import {
  useFetchStats,
  useFetchEconomics,
  useNetworkRouter,
  useLoopManager,
  useCheckVersion,
  useGetURLNetwork,
  useInitDatadog,
  useSetBrowserClassNames,
  useSetDappConfig
} from 'hooks';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Unavailable } from './components/Unavailable';

export const Layout = () => {
  const { pathname } = useLocation();
  const urlNetwork = useGetURLNetwork();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const fetchEconomics = useFetchEconomics();
  const fetchStats = useFetchStats();

  useNetworkRouter();
  useLoopManager();
  useCheckVersion();
  useInitDatadog();
  useSetDappConfig();
  useSetBrowserClassNames();

  const [freeze, setFreeze] = useState(false);

  const offline = !window.navigator.onLine;

  const pathArray = pathname.split('/');
  const pageClass =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];

  useEffect(() => {
    if (urlNetwork && urlNetwork.id === activeNetworkId) {
      fetchStats();
      fetchEconomics();
    }
  }, [activeNetworkId, urlNetwork]);

  return (
    <div className={`d-flex ${pageClass}`}>
      <NetworkReady>
        <div
          className={classNames('main-content', {
            'overflow-hidden vh-100': freeze
          })}
        >
          <Header onExpand={setFreeze} />
          <NotificationsBar />
          <main className='main-content-container d-flex flex-column'>
            {offline ? (
              <Unavailable />
            ) : (
              <>
                <Hero />
                <div className='page-container' data-testid='layoutContainer'>
                  <Outlet />
                </div>
              </>
            )}
          </main>
          <Footer />
        </div>
      </NetworkReady>
      <MetaTags />
    </div>
  );
};
