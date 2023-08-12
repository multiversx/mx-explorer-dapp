import React from 'react';
import { faPalette } from '@fortawesome/pro-regular-svg-icons';

import { PageState } from 'components';

export const FailedNftDetails = ({
  identifier
}: {
  identifier: string | undefined;
}) => {
  return (
    <PageState
      icon={faPalette}
      title='Unable to locate this NFT'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{identifier}</span>
        </div>
      }
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
