import { PageState } from 'components';
import { faExchangeAlt } from 'icons/regular';

export const FailedTransactions = () => {
  return (
    <PageState
      icon={faExchangeAlt}
      title='Unable to load transactions'
      isError
    />
  );
};
