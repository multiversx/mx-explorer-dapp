import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { useIsMainnet } from 'hooks';
import { ChartWrapper } from './components/ChartWrapper';
import { Loader, useAdapter } from '../../components';
import { activeNetworkSelector } from '../../redux/selectors';
import { ChartListType } from '../AnalyticsCompare';
import { AnalyticsChart } from '../AnalyticsCompare/AnalyticsChart';
import { ChartResolution } from '../AnalyticsCompare/AnalyticsChart/components/ChartResolution';
import {
  FIRST_SERIES_ID,
  RANGE,
  SECOND_SERIES_ID
} from '../AnalyticsCompare/constants';
import { FailedAnalytics } from '../AnalyticsCompare/FailedAnalytics';
import { NoAnalytics } from '../AnalyticsCompare/NoAnalytics';

export const Analytics = () => {
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const firstSeriesId = searchParams.get(FIRST_SERIES_ID);
  const secondSeriesId = searchParams.get(SECOND_SERIES_ID);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChartList } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [chartList, setChartList] = useState<ChartListType[]>([]);
  const [selectedPills, setSelectedPills] = useState<ChartListType[]>([]);

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

  const setNewQueryParameters = (params: Record<string, string>) => {
    const newQueryParameters: URLSearchParams = new URLSearchParams();

    Object.entries(params).forEach((entry) => {
      newQueryParameters.set(entry[0], entry[1]);
    });

    const options = {
      pathname: location.pathname,
      search: `?${createSearchParams(newQueryParameters)}`
    };

    navigate(options, { replace: true });
  };

  const transactionsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-transactions-'));
  }, [chartList]);

  const tokenTransfersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-token-transfers-'));
  }, [chartList]);

  const nftTransferChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-nft-transfers-'));
  }, [chartList]);

  const dailyActiveUsersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-active-users-'));
  }, [chartList]);

  const networkAndDeveloperFeesChart = useMemo(() => {
    return chartList?.filter(
      (sc) =>
        sc.id.includes('-fees-captured-') ||
        sc.id.includes('-developer-rewards-')
    );
  }, [chartList]);

  const newStuffCreatedChart = useMemo(() => {
    return chartList?.filter(
      (sc) =>
        sc.id.includes('-new-smart-contracts-') ||
        sc.id.includes('-new-nfts-') ||
        sc.id.includes('-new-esdts-')
    );
  }, [chartList]);

  const stackedAmountChart = useMemo(() => {
    return chartList?.filter((sc) =>
      sc.id.includes('-total-value-locked-plus-staking-')
    );
  }, [chartList]);

  const noOfUsersStakingChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-users-staking-'));
  }, [chartList]);

  const aprsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-apr-'));
  }, [chartList]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getData, [activeNetworkId]);

  useEffect(() => {
    const firstSeries = chartList.find((x) => x.id === firstSeriesId);
    const secondSeries = chartList.find((x) => x.id === secondSeriesId);

    if (!firstSeries || !secondSeries) {
      setSelectedPills(chartList.slice(0, 2));
      return;
    }

    setSelectedPills([firstSeries, secondSeries]);
  }, [firstSeriesId, secondSeriesId, chartList]);

  useEffect(() => {
    if (selectedPills.length < 2) {
      return;
    }

    setNewQueryParameters({
      [FIRST_SERIES_ID]: selectedPills[0].id,
      [SECOND_SERIES_ID]: selectedPills[1].id,
      [RANGE]: searchParams.get(RANGE) ?? ChartResolution['month'].range
    });
  }, [selectedPills]);

  if (!isMainnet) {
    navigate('/');
  }

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedAnalytics />}
      {dataReady === true && chartList.length === 0 && <NoAnalytics />}
      {selectedPills.length < 2 && <FailedAnalytics />}
      {dataReady === true && selectedPills.length >= 2 && (
        <div className='analytics container page-content'>
          <div className='card card-lg card-black'>
            <div className='card-header d-flex align-items-center'>
              <div className='analytics-nav-item'>Key Metrics</div>
              <a href='/analytics/compare' className='analytics-nav-item link'>
                Compare
              </a>
            </div>

            <div className='card-body d-flex justify-content-between flex-wrap'>
              <h2 className='py-spacer'>User activity & transactions</h2>
              <ChartWrapper>
                <div className='px-3 p-3'>
                  <AnalyticsChart series={transactionsChart} />
                </div>
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={tokenTransfersChart} />
                </div>
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={nftTransferChart} />
                </div>
              </ChartWrapper>
              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={dailyActiveUsersChart} />
                </div>
              </ChartWrapper>

              <h2 className='py-spacer'>Developers / Validators</h2>

              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={networkAndDeveloperFeesChart} />
                </div>
              </ChartWrapper>

              <h2 className='py-spacer'>Application / Token Metrics</h2>

              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={newStuffCreatedChart} />
                </div>
              </ChartWrapper>

              <h2 className='py-spacer'>Staking</h2>

              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={stackedAmountChart} />
                </div>
              </ChartWrapper>
              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={noOfUsersStakingChart} />
                </div>
              </ChartWrapper>
              <ChartWrapper>
                <div className='px-3 pb-3'>
                  <AnalyticsChart series={aprsChart} />
                </div>
              </ChartWrapper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
