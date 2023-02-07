import React, { useState, useEffect } from 'react';
import { faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Search } from 'components';
import { useActiveRoute, useIsMainnet, usePageStats } from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/ChartContractsTransactions';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import { analyticsRoutes } from 'routes';
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard,
  HeroPills,
  StatsCard,
  HeroHome,
  HeroNodes
} from 'widgets';

import {
  useShowCustomStats,
  useShowGlobalStats,
  useShowNodesStats,
  useShowTransactionStats
} from './hooks';
import { getCustomPageName } from '../../helpers';

export const Hero = () => {
  const { pathname } = useLocation();

  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { pageStats } = usePageStats();

  const isHome = activeRoute('/');
  const isAnalytics =
    activeRoute(analyticsRoutes.analytics) ||
    activeRoute(analyticsRoutes.compare);
  const showCustomStats = useShowCustomStats() && isMainnet;
  const showGlobalStats = useShowGlobalStats();
  const showNodesStats = useShowNodesStats();
  const showTransactionsStats = useShowTransactionStats() && isMainnet;

  const pathArray = pathname.split('/');
  const basePage =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];
  const pageName = getCustomPageName({ pathname, basePage });

  let heroTypeClassName = '';
  if (showTransactionsStats) {
    heroTypeClassName = 'transactions-stats';
  }
  if (showNodesStats) {
    heroTypeClassName = 'nodes-stats';
  }

  return (
    <div className='container'>
      {isHome ? (
        <HeroHome />
      ) : (
        <div className='row main-search-container mt-3'>
          <div className='col-12 col-lg-5 col-xl-6'>
            <Search className='input-group-black' />
          </div>
          <div className='col-12 col-lg-7 col-xl-6'>
            <HeroPills />
          </div>
        </div>
      )}

      {showGlobalStats && (
        <div
          className={`page-hero card card-lg card-black mb-3 ${heroTypeClassName}`}
        >
          <div className='card-header'>
            <h2 className='title mb-0 text-capitalize'>
              {isAnalytics ? (
                <>
                  {`MultiversX Blockchain ${pageName}`}{' '}
                  <span className='text-neutral-500'> (Beta)</span>
                </>
              ) : (
                <>{pageName}</>
              )}
            </h2>
          </div>
          {showCustomStats ? (
            <div className='card-body d-flex flex-row flex-wrap gap-3 custom-stats'>
              {pageStats?.data.map((item) => (
                <StatsCard
                  key={item.id}
                  title={item.title}
                  subTitle={item.subTitle}
                  icon={item.icon}
                  value={item.value ? item.value.toString() : ''}
                  className='card-solitary'
                />
              ))}
            </div>
          ) : (
            <>
              {showTransactionsStats && (
                <div className='card-body p-0'>
                  <ChartContractsTransactions />
                </div>
              )}

              {showNodesStats && <HeroNodes />}

              {!(showTransactionsStats || showNodesStats) && (
                <div className='card-body d-flex flex-row flex-wrap gap-3'>
                  <TransactionsStatsCard />
                  <AccountsStatsCard />
                  <BlockHeightStatsCard neutralColors />
                  {isMainnet && <ValidatorsStatusCard isSmall />}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
