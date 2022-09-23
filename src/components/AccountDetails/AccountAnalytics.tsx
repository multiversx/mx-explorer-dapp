import React from 'react';
import moment from 'moment';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';

import { denomination, decimals } from 'appConfig';
import { useGlobalState } from 'context';

import { adapter, Loader, PageState, Chart } from 'sharedComponents';
import { ChartDataType, ChartConfigType } from 'sharedComponents/Chart/helpers/types';
import denominate from 'sharedComponents/Denominate/denominate';

import AccountTabs from './AccountLayout/AccountTabs';

interface AccountBalanceHistoryType {
  address: string;
  balance: string;
  timestamp: number;
  isSender?: boolean;
}

const processBalanceHistory = ({ data }: { data: AccountBalanceHistoryType[] }) => {
  if (data.length > 0) {
    const processedData = data.map((entry) => {
      const value = denominate({
        input: entry.balance,
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
        addCommas: false,
      });
      return {
        time: moment.unix(entry.timestamp).utc().format(),
        value,
      };
    });

    return processedData;
  }
  return [];
};

const AccountAnalytics = () => {
  const {
    accountDetails,
    activeNetwork: { erdLabel },
  } = useGlobalState();
  const { activeNetworkId } = useGlobalState();
  const { getAccountHistory } = adapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);
  const [startDate, setStartDate] = React.useState<string>('...');
  const [endDate, setEndDate] = React.useState<string>('...');

  const getData = () => {
    getAccountHistory({ address: accountDetails.address, size: 100 }).then(
      (accountsHistoryData) => {
        if (accountsHistoryData.success) {
          const reversedData = accountsHistoryData.data.reverse();
          const startTimestamp = reversedData[0].timestamp;
          const endTimestamp = reversedData[reversedData.length - 1].timestamp;
          setChartData(processBalanceHistory({ data: reversedData }));
          setStartDate(moment.unix(startTimestamp).utc().format('MMM DD, YYYY HH:mm:ss UTC'));
          setEndDate(moment.unix(endTimestamp).utc().format('MMM DD, YYYY HH:mm:ss UTC'));
        }
        setDataReady(accountsHistoryData.success);
      }
    );
  };

  const config: ChartConfigType[] = [
    {
      id: 'balance',
      label: 'balance',
      gradient: 'defaultGradient',
      data: chartData,
      showUsdValue: true,
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
        <div className="card-header-item d-flex align-items-center bg-light">
          Account {erdLabel} Balance ( from {startDate} to {endDate} )
        </div>
      </div>
      <div className="card-body px-lg-spacer py-lg-4">
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title="Unable to load balance chart"
              className="my-auto"
              titleClassName="mt-0"
              dataTestId="accountChartError"
            />
          )}
          {dataReady === true && (
            <>
              {chartData.length > 1 ? (
                <div className="mx-n4">
                  <Chart.Area
                    config={config}
                    currency={erdLabel}
                    tooltip={{ showUsdValue: true, dateFormat: 'MMM DD, YYYY HH:mm:ss UTC' }}
                  ></Chart.Area>
                </div>
              ) : (
                <PageState
                  icon={faChartBar}
                  title="Not enough entries to display the chart"
                  className="my-auto"
                  titleClassName="mt-0"
                  dataTestId="accountChartSmall"
                />
              )}
            </>
          )}
        </Chart.Body>
      </div>
    </div>
  );
};

export default AccountAnalytics;
