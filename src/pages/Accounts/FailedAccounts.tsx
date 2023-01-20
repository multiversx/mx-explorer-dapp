import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { PageState } from 'sharedComponents';

export default function FailedAccounts() {
  return (
    <PageState
      icon={faUser}
      title="Unable to load accounts"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
