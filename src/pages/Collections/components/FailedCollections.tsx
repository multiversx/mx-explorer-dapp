import React from 'react';
import { faCoins } from 'icons/regular';

import { PageState } from 'components';

export const FailedCollections = () => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to load Collections'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
