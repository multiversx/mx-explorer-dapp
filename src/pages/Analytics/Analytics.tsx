import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, useAdapter } from 'components';
import { useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { AnalyticsStackedChart } from './AnalyticsChart/AnalyticsStackedChart';
import { ChartResolution } from './AnalyticsChart/components/ChartResolution';
import { FIRST_SERIES_ID, RANGE, SECOND_SERIES_ID } from './constants';
import { FailedAnalytics } from './FailedAnalytics';
import { NoAnalytics } from './NoAnalytics';

export interface ChartListType {
  id: string;
  label: string;
  path: string;
  longPath: string;
}

export const Analytics = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

  const [searchParams, setSearchParams] = useSearchParams();

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

    setSearchParams(newQueryParameters);
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
        {dataReady === true && selectedPills.length === 2 && (
          <div className='analytics container page-content'>
            <div className='card p-4'>
              <div className='row mb-3'>
                <h5>Key Metrics</h5>
              </div>
              <div className='row mb-2 text-neutral-400'>
                <span>Select metrics to compare</span>
              </div>
              <div className='row mb-3'>
                {chartList.map((series) => (
                  <div
                    key={series.id}
                    className='col'
                    onClick={onSelectPill(series)}
                  >
                    <span
                      className={`badge rounded-pill cursor-pointer ${
                        selectedPills.find((x) => x.id === series.id)
                          ? 'bg-light text-dark'
                          : 'bg-dark'
                      }`}
                    >
                      {series.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className='row'>
                <AnalyticsStackedChart
                  firstSeries={selectedPills[0]}
                  secondSeries={selectedPills[1]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
