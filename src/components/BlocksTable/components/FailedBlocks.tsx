import React from 'react';
import { faCube } from 'icons/regular';

import { PageState } from 'components';

export const FailedBlocks = () => {
  return (
    <PageState
      icon={faCube}
      title='Unable to load blocks'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
