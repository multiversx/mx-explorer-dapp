import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

export const Analytics = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();

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
          setSelectedPills(chartData.slice(0, 2));
        }
      }
      setDataReady(chartList.success);
    });
  };

  const onSelectPill = (series: ChartListType) => () => {
    setSelectedPills((pills) => [pills[1], series]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getData, [activeNetworkId]);

  if (!isMainnet) {
    navigate('/');
  }

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedAnalytics />}
      {dataReady === true && chartList.length === 0 && <NoAnalytics />}
      {dataReady === true && selectedPills.length < 2 && <NoAnalytics />}

      <div ref={ref}>
        {dataReady === true && (
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
