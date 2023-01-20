import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'sharedComponents';

export default function FailedTokens() {
  return (
    <PageState
      icon={faCoins}
      title="Unable to load Tokens"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
