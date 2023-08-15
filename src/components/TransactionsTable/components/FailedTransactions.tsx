import React from 'react';
import { faExchangeAlt } from 'icons/regular';

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
