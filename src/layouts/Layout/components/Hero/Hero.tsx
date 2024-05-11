import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { FormatEGLD, Search } from 'components';
import { getSubdomainNetwork } from 'helpers';
import {
  useActiveRoute,
  useIsMainnet,
  useHasGrowthWidgets,
  usePageStats
} from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/components/ChartContractsTransactions';
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
  HeroNodes,
  HeroApplications
} from 'widgets';

import {
  useShowApplicationsStats,
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
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { id: activeNetworkId, egldLabel = '' } = useSelector(
    activeNetworkSelector
  );
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { pageStats } = usePageStats();

  const isHome = activeRoute('/');
  const isAnalytics =
    activeRoute(analyticsRoutes.analytics) ||
    activeRoute(analyticsRoutes.compare);
  const showCustomStats = useShowCustomStats() && hasGrowthWidgets;
  const showGlobalStats = useShowGlobalStats();
  const showNodesStats = useShowNodesStats();
  const showApplicationsStats = useShowApplicationsStats() && hasGrowthWidgets;
  const showTransactionsStats = useShowTransactionStats() && hasGrowthWidgets;

  const { subdomainNetwork } = getSubdomainNetwork();
  const pathArray = pathname.split('/').filter((path) => path);

  const basePage =
    activeNetworkId !== defaultNetworkId &&
    pathArray.length > 1 &&
    !subdomainNetwork
      ? pathArray?.[1]
      : pathArray?.[0];

  const pageName = getCustomPageName({ pathname, basePage });

  let heroTypeClassName = '';
  if (showTransactionsStats && !showCustomStats) {
    heroTypeClassName = 'transactions-stats';
  }
  if (showNodesStats) {
    heroTypeClassName = 'nodes-stats';
  }
  if (showApplicationsStats) {
    heroTypeClassName = 'applications-stats';
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
            <div className='card-body'>
              <div className='d-flex flex-row flex-wrap gap-3 custom-stats'>
                {pageStats?.data.map((item) => (
                  <StatsCard
                    key={item.id}
                    title={item.title}
                    subTitle={item.subTitle}
                    icon={item.icon}
                    value={
                      String(item.value).includes(egldLabel) ? (
                        <FormatEGLD value={item.value} superSuffix />
                      ) : (
                        item.value
                      )
                    }
                    className='card-solitary'
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {showApplicationsStats && <HeroApplications />}
              {showTransactionsStats && (
                <div className='card-body p-0'>
                  <ChartContractsTransactions />
                </div>
              )}
              {showNodesStats && <HeroNodes />}

              {!(
                showTransactionsStats ||
                showNodesStats ||
                showApplicationsStats
              ) && (
                <div className='card-body d-flex flex-row flex-wrap gap-3'>
                  <TransactionsStatsCard />
                  <AccountsStatsCard />
                  <BlockHeightStatsCard />
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
