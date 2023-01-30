import React, { useEffect, useRef, useState } from 'react';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { useIsMainnet } from 'hooks';
import { ChartWrapper } from './components/ChartWrapper';
import {
  FIRST_SERIES_ID,
  RANGE,
  SECOND_SERIES_ID
} from '../AnalyticsCompare/constants';
import { useSelector } from 'react-redux';
import { activeNetworkSelector } from '../../redux/selectors';
import { Loader, useAdapter } from '../../components';
import { ChartResolution } from '../AnalyticsCompare/AnalyticsChart/components/ChartResolution';
import { ChartListType } from '../AnalyticsCompare';
import { FailedAnalytics } from '../AnalyticsCompare/FailedAnalytics';
import { NoAnalytics } from '../AnalyticsCompare/NoAnalytics';
import { analyticsRoutes } from 'routes';
import { AnalyticsChart } from '../AnalyticsCompare/AnalyticsChart';

export const Analytics = () => {
  const ref = useRef(null);
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

  const onSelectPill = (series: ChartListType) => () => {
    if (selectedPills.find((pill) => pill.id === series.id)) {
      return;
    }

    setSelectedPills((pills) => [pills[1], series]);
  };

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
              <ChartWrapper>
                {' '}
                <div className='row p-3'>
                  <AnalyticsChart
                    // charts={chartList.filter((x) =>
                    //   x.id.includes('transactions')
                    // )}
                    series={[
                      chartList[0],
                      chartList[1],
                      chartList[2],
                      chartList[3]
                    ]}
                  />
                </div>
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='row p-3'>
                  <AnalyticsChart series={[chartList[0]]} />
                </div>
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='row p-3'>
                  <AnalyticsChart series={[chartList[1]]} />
                </div>
              </ChartWrapper>
              <ChartWrapper>
                <div className='row p-3'>
                  <AnalyticsChart series={[chartList[2]]} />
                </div>
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='row p-3'>
                  <AnalyticsChart series={[chartList[3]]} />
                </div>{' '}
              </ChartWrapper>
              <ChartWrapper size='half'>
                <div className='row p-3'>
                  <AnalyticsChart series={[chartList[4]]} />
                </div>{' '}
              </ChartWrapper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
