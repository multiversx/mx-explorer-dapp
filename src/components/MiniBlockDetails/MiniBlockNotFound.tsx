import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import React from 'react';
import { PageState } from 'sharedComponents';

interface MiniBlockNotFoundType {
  miniBlockHash: string | undefined;
}

export default function MiniBlockNotFound({ miniBlockHash }: MiniBlockNotFoundType) {
  return (
    <div className="card card-small">
      <div className="card-body">
        <PageState
          icon={faCube}
          title="Unable to locate this miniblock hash"
          description={miniBlockHash}
          className="py-spacer d-flex h-100 align-items-center justify-content-center"
          dataTestId="errorScreen"
        />
      </div>
    </div>
  );
}
