import React from 'react';
import { faCoins } from 'icons/regular';

import { PageState } from 'components';

export const FailedTokens = () => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to load Meta-ESDT Tokens'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
