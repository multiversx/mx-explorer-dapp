import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, useAdapter } from 'components';
import { useIsMainnet } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';
import { AnalyticsStackedChartPoC } from './AnalyticsChart/AnalyticsStackedChartsPoC';
import { FailedAnalytics } from './FailedAnalytics';
import { NoAnalytics } from './NoAnalytics';

export interface ChartListType {
  id: string;
  label: string;
  path: string;
  longPath: string;
}

const FIRST_SERIES_ID = 'firstSeriesId';
const SECOND_SERIES_ID = 'secondSeriesId';

export const Analytics = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

  const [searchParams, setSearchParams] = useSearchParams();

  // @ts-ignore
  console.log(Object.fromEntries([...searchParams]));
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

  const onSelectPill = (series: ChartListType) => () => {
    setSelectedPills((pills) => {
      const newQueryParameters: URLSearchParams = new URLSearchParams();
      const newSelectedPills = [pills[1], series];

      newQueryParameters.set(FIRST_SERIES_ID, pills[1].id);
      newQueryParameters.set(SECOND_SERIES_ID, series.id);

      setSearchParams(newQueryParameters);

      return newSelectedPills;
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getData, [activeNetworkId]);

  useEffect(() => {
    const firstSeries = chartList.find((x) => x.id === firstSeriesId);
    const secondSeries = chartList.find((x) => x.id === secondSeriesId);

    console.log(chartList);
    console.log(firstSeries);
    console.log(secondSeries);

    if (!firstSeries || !secondSeries) {
      setSelectedPills(chartList.slice(0, 2));
      return;
    }

    setSelectedPills([firstSeries, secondSeries]);
  }, [firstSeriesId, secondSeriesId, chartList]);

  if (!isMainnet) {
    navigate('/');
  }

  console.log('selectedPills = ', selectedPills);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedAnalytics />}
      {dataReady === true && chartList.length === 0 && <NoAnalytics />}
      {selectedPills.length < 2 && <NoAnalytics />}

      <div ref={ref}>
        {dataReady === true && selectedPills.length === 2 && (
          <div className='analytics container page-content'>
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
              <AnalyticsStackedChartPoC
                ids={selectedPills.map((pill) => pill.path)}
                firstSeriesPath={selectedPills[0].path}
                secondSeriesPath={selectedPills[1].path}
              />

              {/*{chartList.map((chart) => (*/}
              {/*  <div className='col-12 col-lg-6 mt-spacer' key={chart.id}>*/}
              {/*    <AnalyticsChart id={chart.id} path={chart.path} />*/}
              {/*  </div>*/}
              {/*))}*/}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
