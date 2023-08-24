import { PageState } from 'components';
import { faExchangeAlt } from 'icons/regular';

export const NoTransactions = () => {
  return (
    <PageState
      icon={faExchangeAlt}
      title='No transactions'
      className='py-spacer my-auto'
    />
  );
};
