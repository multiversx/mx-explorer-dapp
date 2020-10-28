import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { faWallet } from '@fortawesome/pro-regular-svg-icons/faWallet';
import React from 'react';
import { numInitCharactersForScAddress } from 'appConfig';
import { PageState } from 'sharedComponents';

export default function FailedAddress({ addressId }: { addressId: string | undefined }) {
  const showIcon =
    numInitCharactersForScAddress > 0 &&
    String(addressId).startsWith('0'.repeat(numInitCharactersForScAddress));

  return (
    <div className="card card-small">
      <div className="card-body" data-testid="errorScreen">
        <PageState
          icon={showIcon ? faCode : faWallet}
          title="Unable to locate this address hash"
          description={addressId}
          className="py-spacer d-flex h-100 align-items-center justify-content-center"
        />
      </div>
    </div>
  );
}
