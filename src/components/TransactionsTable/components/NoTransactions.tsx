import React from 'react';
import { faExchangeAlt } from 'icons/regular';

import { PageState } from 'components';

export const NoTransactions = () => {
  return (
    <PageState
      icon={faExchangeAlt}
      title='No transactions'
      className='py-spacer my-auto'
    />
  );
};
