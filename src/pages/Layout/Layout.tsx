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
  useCheckVersion
} from 'hooks';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PageLayout } from './components/PageLayout';
import { Unavailable } from './components/Unavailable';
import { getCustomPageName, formatClassName } from './helpers';

export const Layout = ({ children }: { children: ReactNode }) => {
  const [freeze, setFreeze] = useState(false);

  const browser = UAParser();
  const { pathname } = useLocation();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  useNetworkRouter();
  useLoopManager();
  useFetchEconomics();
  useFetchStats();
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

  return (
    <div className={`d-flex flex-fill vh-100 ${pageClass}`}>
      <main
        className={classNames(
          'main-content',
          'd-flex',
          'flex-column',
          'flex-grow-1',
          { 'overflow-hidden vh-100': freeze }
        )}
      >
        <Header onExpand={setFreeze} />

        <NotificationsBar />
        <div className='main-content-container container-fluid p-0 d-flex flex-column'>
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
