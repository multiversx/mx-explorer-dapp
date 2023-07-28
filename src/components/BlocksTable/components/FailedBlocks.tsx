import React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';

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
