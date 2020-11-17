import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { PageState } from 'sharedComponents';

export default function FailedAddresses() {
  return (
    <PageState
      icon={faUser}
      title="Unable to load addresses"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
