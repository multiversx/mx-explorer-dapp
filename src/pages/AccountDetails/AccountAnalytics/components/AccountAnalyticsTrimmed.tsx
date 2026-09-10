import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
import { formatBigNumber } from 'helpers';
import { faExchangeAlt } from 'icons/regular';
import { accountSelector } from 'redux/selectors';

export const AccountAnalyticsTrimmed = () => {
  const { account } = useSelector(accountSelector);
  const { txCount } = account;

  const isTrimmed = txCount > MAX_RESULTS;

  if (!isTrimmed) {
    return null;
  }

  return (
    <div className='card-header-item card bg-table-header p-3 d-flex flex-row align-items-center gap-2 mb-4'>
      <FontAwesomeIcon icon={faExchangeAlt} className='text-primary' />{' '}
      Analytics based on the most recent{' '}
      {formatBigNumber({ value: MAX_RESULTS })} transactions.
    </div>
  );
};
