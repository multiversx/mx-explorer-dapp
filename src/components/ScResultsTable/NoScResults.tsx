import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons';

import { PageState } from 'components';

export const NoScResults = () => {
  return (
    <PageState
      icon={faCode}
      title='No Smart Contract Results'
      className='py-spacer my-auto'
    />
  );
};
