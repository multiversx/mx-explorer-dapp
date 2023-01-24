import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { PageState } from 'components';

export const FailedAccounts = () => {
  return (
    <PageState
      icon={faUser}
      title='Unable to load accounts'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
