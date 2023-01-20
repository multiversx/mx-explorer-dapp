import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'sharedComponents';

export default function FailedCollections() {
  return (
    <PageState
      icon={faCoins}
      title="Unable to load Collections"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
