import React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';

import { PageState } from 'components';

export const FailedTokenDetails = ({
  tokenId
}: {
  tokenId: string | undefined;
}) => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to locate this token'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{tokenId}</span>
        </div>
      }
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
