import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import * as React from 'react';
import { numInitCharactersForScAddress } from 'appConfig';
import { PageState } from 'sharedComponents';

export default function FailedAccounts({ address }: { address: string | undefined }) {
  const showIcon =
    numInitCharactersForScAddress > 0 &&
    String(address).startsWith('0'.repeat(numInitCharactersForScAddress));

  return (
    <PageState
      icon={showIcon ? faCode : faUser}
      title="Unable to locate this account"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{address}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
