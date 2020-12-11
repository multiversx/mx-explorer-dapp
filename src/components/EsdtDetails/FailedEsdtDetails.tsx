import * as React from 'react';
import { PageState } from 'sharedComponents';
import { faCoin } from '@fortawesome/pro-regular-svg-icons/faCoin';

export default function FailedAccounts({ esdtId }: { esdtId: string | undefined }) {
  return (
    <PageState
      icon={faCoin}
      title="Unable to locate this esdt"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{esdtId}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
