import * as React from 'react';
import { PageState } from 'sharedComponents';
import { faCoin } from '@fortawesome/pro-regular-svg-icons/faCoin';

export default function FailedTokenDetails({ tokenId }: { tokenId: string | undefined }) {
  return (
    <PageState
      icon={faCoin}
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
