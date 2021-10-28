import * as React from 'react';
import { PageState } from 'sharedComponents';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';

export default function FailedTokenDetails({ tokenId }: { tokenId: string | undefined }) {
  return (
    <PageState
      icon={faCoins}
      title="Unable to locate this token"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{tokenId}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
