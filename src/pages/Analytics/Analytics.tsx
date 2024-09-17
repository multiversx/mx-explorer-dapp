import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { InfoTooltip, Loader, Tabs } from 'components';
import { ChartListType } from 'components/Chart/helpers/types';
import { useAdapter, useHasGrowthWidgets, useNetworkRoute } from 'hooks';

import { AnalyticsChart } from 'pages/AnalyticsCompare/AnalyticsChart';
import { FailedAnalytics } from 'pages/AnalyticsCompare/components/FailedAnalytics';
import { NoAnalytics } from 'pages/AnalyticsCompare/components/NoAnalytics';
import { activeNetworkSelector } from 'redux/selectors';
import { analyticsRoutes } from 'routes';
import { ChartContractsTransactions, MostUsed } from 'widgets';

import { ChartWrapper } from './components/ChartWrapper';

export const Analytics = () => {
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChartList } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [chartList, setChartList] = useState<ChartListType[]>([]);

  const getData = () => {
    getAnalyticsChartList().then((chartList) => {
      if (chartList.success) {
        const chartData = chartList?.data;

        if (chartData) {
          setChartList(chartData);
        }
      }
      setDataReady(chartList.success);
    });
  };

  // const transactionsChart = useMemo(() => {
  //   return chartList?.filter((sc) => sc.id.includes('-transactions'));
  // }, [chartList]);

  const tokenTransfersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('token-transfers'));
  }, [chartList]);

  const nftTransferChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('nft-transfers'));
  }, [chartList]);

  const dailyActiveUsersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id === 'active-users');
  }, [chartList]);

  const networkAndDeveloperFeesChart = useMemo(() => {
    const charts = chartList?.filter(
      (sc) =>
        sc.id.includes('fees-captured') || sc.id.includes('developer-rewards')
    );

    if (charts.length === 2) {
      charts[1].dappConfig = {
        ...charts[1].dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    return charts;
  }, [chartList]);

  const newStuffCreatedChart = useMemo(() => {
    const charts = chartList?.filter(
      (sc) => sc.id.includes('new-nfts') || sc.id.includes('new-esdts')
    );
    const smartContractChartCharts = chartList?.filter((sc) =>
      sc.id.includes('new-smart-contracts')
    );
    const nftChartIndex = charts.findIndex((chart) =>
      chart.id.includes('new-nfts')
    );

    if (charts?.[nftChartIndex]) {
      charts[nftChartIndex].dappConfig = {
        ...charts[nftChartIndex].dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    if (smartContractChartCharts.length > 0) {
      return [...charts, ...smartContractChartCharts];
    }

    return charts;
  }, [chartList]);

  const aprsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-apr'));
  }, [chartList]);

  const stakingMetricsChart = useMemo(() => {
    const charts = chartList?.filter((sc) =>
      sc.id.endsWith('staking-total-value-locked-plus-staking')
    );

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.endsWith('staking-total-value-locked-plus-staking')) {
        if (rightYAxisSeriesIds.includes(curr.id)) {
          curr.dappConfig = {
            ...curr.dappConfig,
            id: 'right-axis',
            orientation: 'right'
          };
        }

        acc.push(curr);
      }

      return acc;
    }, [] as ChartListType[]);

    return all;
  }, [chartList]);

  const usersStakingChart = useMemo(() => {
    const charts = chartList?.filter((sc) => sc.id.endsWith('users-staking'));

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.endsWith('users-staking')) {
        if (rightYAxisSeriesIds.includes(curr.id)) {
          curr.dappConfig = {
            ...curr.dappConfig,
            id: 'right-axis',
            orientation: 'right'
          };
        }

        acc.push(curr);
      }

      return acc;
    }, [] as ChartListType[]);

    return all;
  }, [chartList]);

  const usersChart = useMemo(() => {
    const charts = chartList?.filter(
      (sc) => sc.id.includes('accounts-balance') || sc.id === 'accounts'
    );
    return charts;
  }, [chartList]);

  const tabs = [
    {
      tabLabel: 'Key Metrics',
      tabTo: analyticsRoutes.analytics
    },
    {
      tabLabel: 'Compare',
      tabTo: analyticsRoutes.compare
    }
  ];

  useEffect(getData, [activeNetworkId]);

  if (!hasGrowthWidgets) {
    navigate(networkRoute('/'));
  }

  if (dataReady === undefined) return <Loader />;
  if (!dataReady) return <FailedAnalytics />;
  if (dataReady && chartList.length === 0) return <NoAnalytics />;

  return (
    <div className='analytics container page-content'>
      <div className='card card-lg card-black'>
        <div className='card-header'>
          <Tabs tabs={tabs} />
        </div>
        <div className='card-body d-flex justify-content-between flex-wrap'>
          {/* <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Transactions Metrics'}
                series={transactionsChart}
                stacked={true}
                stackedLabel={'Total Transactions'}
              />
            </div>
          </ChartWrapper> */}

          <ChartWrapper>
            <div className='px-3 pb-3'>
              <ChartContractsTransactions isStandalone />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'Token Transactions'}
                series={tokenTransfersChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'NFT Transactions'}
                series={nftTransferChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Total Accounts'}
                series={usersChart}
                customDomain={true}
                tickCountY={6}
                height={420}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                series={dailyActiveUsersChart}
                title={
                  <div className='d-flex align-items-center'>
                    Daily Active Users
                    <InfoTooltip
                      title='Number of accounts that have sent or received transactions in the last 24 hours'
                      className='d-inline-flex'
                      iconClassName='small'
                      persistent
                    />
                  </div>
                }
                height={420}
              />
            </div>
          </ChartWrapper>

          <ChartWrapper>
            <div className='mt-n4 px-3 pb-3'>
              <MostUsed />
            </div>
          </ChartWrapper>

          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'New Applications Deployed'}
                series={newStuffCreatedChart}
                height={420}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Staking Metrics'}
                series={stakingMetricsChart}
                customDomain={true}
                tickCountY={6}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Users Staking'}
                series={usersStakingChart}
                customDomain={true}
                tickCountY={6}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title='APR Metrics'
                series={aprsChart}
                height={360}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'Fees Metrics'}
                series={networkAndDeveloperFeesChart}
                height={360}
              />
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};
