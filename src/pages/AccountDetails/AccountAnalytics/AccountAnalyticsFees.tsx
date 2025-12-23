import { useSelector } from 'react-redux';

import { Chart, Loader, PageState, Range } from 'components';
import { useGetRangeEntries } from 'hooks';
import { faChartBar } from 'icons/regular';
import { accountExtraSelector, activeNetworkSelector } from 'redux/selectors';
import { ChartConfigType } from 'types';

import { useGetTransactionFees } from './hooks';

export const AccountAnalyticsFees = () => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions, accountTransactionsFetched } = accountExtra;
  const processedFeesEntries = useGetTransactionFees();
  const rangeFees = useGetRangeEntries(processedFeesEntries);

  const config: ChartConfigType[] = [
    {
      id: 'fees',
      label: 'fees',
      gradient: 'defaultGradient',
      data: rangeFees,
      showUsdValue: true,
      yAxisConfig: {
        currency: egldLabel,
        orientation: 'left'
      }
    }
  ];

  if (accountTransactionsFetched === undefined) {
    return <Loader />;
  }

  if (accountTransactionsFetched === false) {
    return (
      <PageState
        icon={faChartBar}
        title='Unable to load Account Analytics'
        isError
      />
    );
  }

  if (accountTransactions.length === 0) {
    return <PageState icon={faChartBar} title='No Transactions' isError />;
  }

  return (
    <>
      <div className='d-flex flex-wrap align-items-center w-100 mb-3'>
        <h5 className='table-title d-flex align-items-center'>Fees</h5>
        <Range className='ms-auto' />
      </div>
      <Chart.Body>
        <>
          {rangeFees.length > 1 ? (
            <div className='mx-n4'>
              <Chart.Bar
                config={config}
                tooltip={{
                  dateFormat: 'MMM DD, YYYY'
                }}
              ></Chart.Bar>
            </div>
          ) : (
            <PageState
              icon={faChartBar}
              title={
                rangeFees.length === 0
                  ? 'No account transaction history'
                  : 'Not enough entries to display the chart'
              }
              className='my-auto'
              titleClassName='mt-0'
              data-testid='accountAnalyticsFeesChart'
            />
          )}
        </>
      </Chart.Body>
    </>
  );
};
