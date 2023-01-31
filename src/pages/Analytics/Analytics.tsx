import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ChartListType } from 'components/Chart/helpers/types';
import { useIsMainnet } from 'hooks';
import { analyticsRoutes } from 'routes';

import { Loader, useAdapter } from '../../components';
import { activeNetworkSelector } from '../../redux/selectors';
import { AnalyticsChart } from '../AnalyticsCompare/AnalyticsChart';
import { FailedAnalytics } from '../AnalyticsCompare/FailedAnalytics';
import { NoAnalytics } from '../AnalyticsCompare/NoAnalytics';
import { ChartWrapper } from './components/ChartWrapper';
import { Tabs } from 'components/Tabs';

export const Analytics = () => {
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

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

  const transactionsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-transactions'));
  }, [chartList]);

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

  const newSmartContractsCreatedChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('new-smart-contracts'));
  }, [chartList]);

  const newStuffCreatedChart = useMemo(() => {
    let smartContractChartChart: ChartListType | null = null;

    if (newSmartContractsCreatedChart.length > 0) {
      smartContractChartChart = newSmartContractsCreatedChart[0];
      smartContractChartChart.dappConfig = {
        ...smartContractChartChart.dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    const charts = chartList?.filter(
      (sc) => sc.id.includes('new-nfts') || sc.id.includes('new-esdts')
    );

    if (charts.length === 2) {
      charts[1].dappConfig = {
        ...charts[1].dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    if (smartContractChartChart) {
      return [...charts, smartContractChartChart];
    }

    return charts;
  }, [chartList, newSmartContractsCreatedChart]);

  const aprsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-apr'));
  }, [chartList]);

  const stakingMetricsChart = useMemo(() => {
    const charts = chartList?.filter((sc) => sc.id.startsWith('staking-'));

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.includes('staking-')) {
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
    const charts = chartList?.filter((sc) => sc.id.includes('users-staking'));

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.includes('users-staking')) {
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

  if (!isMainnet) {
    navigate('/');
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
          <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Transactions Metrics'}
                series={transactionsChart}
                stacked={true}
                stackedLabel={'Total Transactions'}
              />
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
              <AnalyticsChart title={'Users Metrics'} series={usersChart} />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart series={dailyActiveUsersChart} />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'New Applications Deployed'}
                series={newStuffCreatedChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Staking Metrics'}
                series={stakingMetricsChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Users Staking'}
                series={usersStakingChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart title='APR Metrics' series={aprsChart} />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'Rewards Metrics'}
                series={networkAndDeveloperFeesChart}
              />
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};
