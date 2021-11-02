import * as React from 'react';
import { PageState } from 'sharedComponents';
import { faPalette } from '@fortawesome/pro-regular-svg-icons/faPalette';

export default function FailedNftDetails({ identifier }: { identifier: string | undefined }) {
  return (
    <PageState
      icon={faPalette}
      title="Unable to locate this NFT"
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
