import { useSelector } from 'react-redux';

import { Chart, Loader, PageState, Range } from 'components';
import { useGetRangeEntries } from 'hooks';
import { faChartBar } from 'icons/regular';
import { accountExtraSelector } from 'redux/selectors';
import { ChartConfigType } from 'types';

import { useGetTransactionHeatmap } from './hooks';

export const AccountAnalyticsTransactions = () => {
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions, accountTransactionsFetched } = accountExtra;

  const data = useGetTransactionHeatmap();
  const rangeTransactions = useGetRangeEntries(data);

  const config: ChartConfigType[] = [
    {
      id: 'transactions',
      label: 'transactions',
      gradient: 'defaultGradient',
      data: rangeTransactions,
      yAxisConfig: {
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
        <h5 className='table-title d-flex align-items-center'>Transactions</h5>
        <Range className='ms-auto' />
      </div>
      <Chart.Body>
        <>
          {rangeTransactions.length > 1 ? (
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
                rangeTransactions.length === 0
                  ? 'No account transaction history'
                  : 'Not enough entries to display the chart'
              }
              className='my-auto'
              titleClassName='mt-0'
              data-testid='accountAnalyticsTransactionsChart'
            />
          )}
        </>
      </Chart.Body>
    </>
  );
};
