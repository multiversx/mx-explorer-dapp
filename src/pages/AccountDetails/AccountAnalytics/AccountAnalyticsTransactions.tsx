import { useSelector } from 'react-redux';

import { Loader, PageState } from 'components';
import { faChartBar } from 'icons/regular';
import { accountExtraSelector } from 'redux/selectors';

export const AccountAnalyticsTransactions = () => {
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions, accountTransactionsFetched } = accountExtra;

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

  return <>Transactions</>;
};
