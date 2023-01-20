import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'components';

export default function FailedTokens() {
  return (
    <PageState
      icon={faCoins}
      title="Unable to load Meta-ESDT Tokens"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
