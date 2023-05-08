import React, { useState, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UAParser } from 'ua-parser-js';

import { NotificationsBar } from 'components';
import {
  useFetchStats,
  useFetchEconomics,
  useNetworkRouter,
  useLoopManager,
  useCheckVersion,
  useGetURLNetwork
} from 'hooks';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PageLayout } from './components/PageLayout';
import { Unavailable } from './components/Unavailable';
import { formatClassName } from './helpers';

export const Layout = ({ children }: { children: ReactNode }) => {
  const [freeze, setFreeze] = useState(false);

  const browser = UAParser();
  const { pathname } = useLocation();
  const urlNetwork = useGetURLNetwork();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const fetchEconomics = useFetchEconomics();
  const fetchStats = useFetchStats();

  useNetworkRouter();
  useLoopManager();
  useCheckVersion();

  const offline = !window.navigator.onLine;

  const pathArray = pathname.split('/');
  const pageClass =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];

  useEffect(() => {
    if (browser?.browser?.name) {
      document.body.classList.add(formatClassName(browser.browser.name));
    }
    if (browser?.engine?.name) {
      document.body.classList.add(formatClassName(browser.engine.name));
    }
    if (browser?.os?.name) {
      document.body.classList.add(formatClassName(browser.os.name));
    }
  }, []);

  useEffect(() => {
    if (urlNetwork && urlNetwork.id === activeNetworkId) {
      fetchStats();
      fetchEconomics();
    }
  }, [activeNetworkId, urlNetwork]);

  return (
    <div className={`d-flex ${pageClass}`}>
      <main
        className={classNames('main-content', {
          'overflow-hidden vh-100': freeze
        })}
      >
        <Header onExpand={setFreeze} />

        <NotificationsBar />
        <div className='main-content-container d-flex flex-column'>
          {offline ? (
            <Unavailable />
          ) : (
            <>
              <Hero />
              <div className='page-container' data-testid='mainPageContent'>
                <PageLayout>{children}</PageLayout>
              </div>
            </>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
};
