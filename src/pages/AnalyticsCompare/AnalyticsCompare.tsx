import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { Loader, useAdapter, Led } from 'components';
import { useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { analyticsRoutes } from 'routes';
import { AnalyticsChart } from './AnalyticsChart';
import { AnalyticsStackedChart } from './AnalyticsChart/AnalyticsStackedChart';
import { ChartResolution } from './AnalyticsChart/components/ChartResolution';
import { FIRST_SERIES_ID, RANGE, SECOND_SERIES_ID } from './constants';
import { FailedAnalytics } from './FailedAnalytics';
import { NoAnalytics } from './NoAnalytics';
import { ChartYAxisFormatConfig } from '../../components/Chart/helpers/types';

export interface ChartListType {
  id: string;
  label: string;
  path: string;
  longPath: string;
  dappConfig?: ChartYAxisFormatConfig;
  dynamicLabel?: string[];
}

export const AnalyticsCompare = () => {
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

      <div ref={ref}>
        {dataReady === true && selectedPills.length >= 2 && (
          <div className='analytics container page-content'>
            <div className='card card-lg card-black'>
              <div className='card-header d-flex align-items-center'>
                <a
                  href={analyticsRoutes.analytics}
                  className='analytics-nav-item link'
                >
                  Key Metrics
                </a>
                <div className='analytics-nav-item'>Compare</div>
              </div>
              <div className='card-body'>
                <h6 className='text-neutral-400 mb-2'>
                  Select metrics to compare
                </h6>
                <div className='d-flex flex-wrap gap-2 mb-3'>
                  {chartList.map((series) => {
                    let selected = '';
                    if (selectedPills[0].id === series.id) {
                      selected = 'first';
                    }
                    if (selectedPills[1].id === series.id) {
                      selected = 'second';
                    }

                    return (
                      <button
                        type='button'
                        key={series.id}
                        onClick={onSelectPill(series)}
                        className={`badge rounded-pill filter-badge d-flex align-items-center ${selected}`}
                      >
                        <Led color='me-2' />
                        {series.label}
                      </button>
                    );
                  })}
                </div>

                <div className='row pb-5'>
                  <AnalyticsStackedChart
                    firstSeries={selectedPills[0]}
                    secondSeries={selectedPills[1]}
                  />
                </div>
                <div className='row mt-5'>
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
              </div>
              <div className='card-footer'></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};