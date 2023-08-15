import React from 'react';
import { faUser } from 'icons/regular';

import { PageState } from 'components';

export const NoAccounts = () => {
  return (
    <PageState
      icon={faUser}
      title='No accounts'
      className='py-spacer my-auto'
    />
  );
};
