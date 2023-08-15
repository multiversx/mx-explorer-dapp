import React from 'react';
import { faCoins } from 'icons/regular';

import { PageState } from 'components';

export const FailedTokens = () => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to load Tokens'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
