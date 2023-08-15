import React from 'react';
import { faCoins } from 'icons/regular';

import { PageState } from 'components';

export const NoCollections = () => {
  return (
    <PageState
      icon={faCoins}
      title='No Collections'
      className='py-spacer my-auto'
    />
  );
};
