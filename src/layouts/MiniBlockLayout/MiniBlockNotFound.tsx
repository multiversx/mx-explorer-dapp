import React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons';
import { PageState } from 'components';

interface MiniBlockNotFoundType {
  miniBlockHash: string | undefined;
}

export const MiniBlockNotFound = ({ miniBlockHash }: MiniBlockNotFoundType) => {
  return (
    <PageState
      icon={faCube}
      title='Unable to locate this miniblock hash'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{miniBlockHash}</span>
        </div>
      }
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
