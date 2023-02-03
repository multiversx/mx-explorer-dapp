import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Search } from 'components';
import { useActiveRoute, useIsMainnet, usePageStats } from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/ChartContractsTransactions';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard,
  HeroPills,
  StatsCard
} from 'widgets';

import {
  useShowGlobalStats,
  useShowCustomStats,
  useShowTransactionStats
} from './hooks';
import { getCustomPageName } from '../../helpers';

export const Hero = () => {
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();

  const { pathname } = useLocation();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const { pageStats } = usePageStats();

  const isHome = activeRoute('/');
  const showGlobalStats = useShowGlobalStats();
  const showCustomStats = useShowCustomStats();
  const showTransactionsStats = useShowTransactionStats();

  const pathArray = pathname.split('/');
  const pageClass =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];
  const pageName = getCustomPageName({ pathname, basePage: pageClass });

  return (
    <>
      {!isHome && (
        <div className='main-search-container mt-3'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 col-lg-5 col-xl-6'>
                <Search className='input-group-black' />
              </div>
              <div className='col-12 col-lg-7 col-xl-6'>
                <HeroPills />
              </div>
            </div>
          </div>
        </div>
      )}

      {showGlobalStats && (
        <div className='container mb-3'>
          <div className='card card-lg card-black'>
            <div className='card-header'>
              <h2 className='title mb-0 text-capitalize'>
                {pageName === 'analytics' ? (
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
                {showTransactionsStats && isMainnet ? (
                  <div className='card-body p-0 mt-nspacer'>
                    <ChartContractsTransactions />
                  </div>
                ) : (
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
        </div>
      )}
    </>
  );
};
