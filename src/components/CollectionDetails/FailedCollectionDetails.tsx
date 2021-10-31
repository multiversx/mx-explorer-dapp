import * as React from 'react';
import { PageState } from 'sharedComponents';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';

export default function FailedTokenDetails({ identifier }: { identifier: string | undefined }) {
  return (
    <PageState
      icon={faCoins}
      title="Unable to locate this collection"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{identifier}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
