import React from 'react';
import { faCode } from 'icons/regular';

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
