import React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons';

import { PageState } from 'components';

export const NoBlocks = ({ title }: { title?: string }) => {
  return (
    <PageState
      icon={faCube}
      title={title ? title : 'No blocks'}
      className='py-spacer my-auto'
    />
  );
};
