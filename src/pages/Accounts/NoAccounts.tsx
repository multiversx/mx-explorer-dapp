import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { PageState } from 'components';

export const NoAccounts = () => {
  return <PageState icon={faUser} title="No accounts" className="py-spacer my-auto" />;
};
