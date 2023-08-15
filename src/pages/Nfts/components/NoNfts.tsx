import React from 'react';
import { faPalette } from 'icons/regular';

import { PageState } from 'components';

export const NoNfts = () => {
  return (
    <PageState icon={faPalette} title='No NFTs' className='py-spacer my-auto' />
  );
};
