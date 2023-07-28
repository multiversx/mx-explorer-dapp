import React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';

import { PageState } from 'components';

export const FailedTransactions = () => {
  return (
    <PageState
      icon={faExchangeAlt}
      title='Unable to load transactions'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
