import React, { useEffect, useState } from 'react';
import { faChartBar } from 'icons/regular';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { Loader, PageState, Chart } from 'components';
import {
  getNormalizedTimeEntries,
  getFrequency
} from 'components/Chart/helpers/getChartBinnedData';
import { ChartDataType, ChartConfigType } from 'components/Chart/helpers/types';
import { useAdapter } from 'hooks';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

export const AccountAnalytics = () => {
  const { account } = useSelector(accountSelector);
  const { address } = account;
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);
  const { getAccountHistory } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [startDate, setStartDate] = useState<string>(ELLIPSIS);
  const [endDate, setEndDate] = useState<string>(ELLIPSIS);

  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim();

  const getData = () => {
    getAccountHistory({ address, size: 100 }).then((accountsHistoryData) => {
      if (
        accountsHistoryData.success &&
        accountsHistoryData?.data?.length > 0
      ) {
        const reversedData = accountsHistoryData.data.reverse();
        const startTimestamp = reversedData[0].timestamp;
        const endTimestamp = reversedData[reversedData.length - 1].timestamp;

        const frequency = getFrequency(reversedData);
        const normalizedData = getNormalizedTimeEntries(
          reversedData,
          frequency
        );
        setChartData(normalizedData);

        setStartDate(moment.unix(startTimestamp).utc().format('MMM DD, YYYY'));
        setEndDate(moment.unix(endTimestamp).utc().format('MMM DD, YYYY'));
      }
      setDataReady(accountsHistoryData.success);
    });
  };

  const config: ChartConfigType[] = [
    {
      id: 'balance',
      label: 'balance',
      gradient: 'defaultGradient',
      stroke: primary,
      data: chartData,
      showUsdValue: true,
      yAxisConfig: {
        currency: egldLabel,
        orientation: 'left'
      }
    }
  ];

  useEffect(getData, [activeNetworkId, searchParams]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          <div className='d-flex align-items-center '>
            Account {egldLabel} Balance{' '}
            {chartData.length > 1 && (
              <span className='text-neutral-400 ms-1'>
                ( from {startDate} to {endDate} )
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='card-body px-lg-spacer py-lg-4'>
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title='Unable to load balance chart'
              className='my-auto'
              titleClassName='mt-0'
              dataTestId='accountChartError'
            />
          )}
          {dataReady === true && (
            <>
              {chartData.length > 1 ? (
                <div className='mx-n4'>
                  <Chart.AreaNew
                    config={config}
                    tooltip={{
                      showUsdValue: true,
                      dateFormat: 'MMM DD, YYYY HH:mm:ss UTC'
                    }}
                  ></Chart.AreaNew>
                </div>
              ) : (
                <PageState
                  icon={faChartBar}
                  title={
                    chartData.length === 0
                      ? 'No account balance history'
                      : 'Not enough entries to display the chart'
                  }
                  className='my-auto'
                  titleClassName='mt-0'
                  dataTestId='accountChartSmall'
                />
              )}
            </>
          )}
        </Chart.Body>
      </div>
    </div>
  );
};
