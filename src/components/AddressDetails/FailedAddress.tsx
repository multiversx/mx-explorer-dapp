import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import React from 'react';
import { numInitCharactersForScAddress } from 'appConfig';
import { PageState } from 'sharedComponents';

export default function FailedAddress({ addressId }: { addressId: string | undefined }) {
  const showIcon =
    numInitCharactersForScAddress > 0 &&
    String(addressId).startsWith('0'.repeat(numInitCharactersForScAddress));

  return (
    <PageState
      icon={showIcon ? faCode : faUser}
      title="Unable to locate this address"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{addressId}</span>
        </div>
      }
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
