import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader, useAdapter } from 'components';
import { useIsMainnet } from 'helpers';

import { activeNetworkSelector } from 'redux/selectors';
import { AnalyticsChart } from './AnalyticsChart';
import { FailedAnalytics } from './FailedAnalytics';
import { NoAnalytics } from './NoAnalytics';
import { AnalyticsStackedChartPoC } from './AnalyticsChart/AnalyticsStackedChartsPoC';

export interface ChartListType {
  id: string;
  path: string;
}

export const Analytics = () => {
  const ref = useRef(null);
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

      <div ref={ref}>
        {dataReady === true && (
          <div className='analytics container page-content'>
            <div className='row'>
              <AnalyticsStackedChartPoC
                ids={[
                  'daily-number-of-contract-to-address-transactions-monthly',
                  'daily-number-of-contract-to-contract-transactions-monthly'
                ]}
                firstSeriesPath={
                  '/explorer/analytics/daily-number-of-contract-to-address-transactions-monthly'
                }
                secondSeriesPath={
                  '/explorer/analytics/daily-number-of-contract-to-contract-transactions-monthly'
                }
              />

              {chartList.map((chart) => (
                <div className='col-12 col-lg-6 mt-spacer' key={chart.id}>
                  <AnalyticsChart id={chart.id} path={chart.path} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
