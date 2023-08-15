import React from 'react';
import { faCoins } from 'icons/regular';

import { PageState } from 'components';

export const NoTokens = () => {
  return (
    <PageState
      icon={faCoins}
      title='No Meta-ESDT Tokens'
      className='py-spacer my-auto'
    />
  );
};
