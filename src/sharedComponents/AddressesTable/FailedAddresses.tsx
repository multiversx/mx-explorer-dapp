import * as React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { PageState } from 'sharedComponents';

export default function FailedAddresses() {
  return (
    <PageState
      icon={faCube}
      title="Unable to load addresses"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
