import * as React from 'react';
import { faPalette } from '@fortawesome/pro-regular-svg-icons/faPalette';
import { PageState } from 'components';

export const FailedNfts = () => {
  return (
    <PageState
      icon={faPalette}
      title="Unable to load NFTs"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
};
