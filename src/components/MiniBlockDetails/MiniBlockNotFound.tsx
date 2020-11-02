import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import React from 'react';
import { PageState } from 'sharedComponents';

interface MiniBlockNotFoundType {
  miniBlockHash: string | undefined;
}

export default function MiniBlockNotFound({ miniBlockHash }: MiniBlockNotFoundType) {
  return (
    <PageState
      icon={faCube}
      title="Unable to locate this miniblock hash"
      description={miniBlockHash}
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
