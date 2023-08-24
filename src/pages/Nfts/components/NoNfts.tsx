import { PageState } from 'components';
import { faPalette } from 'icons/regular';

export const NoNfts = () => {
  return (
    <PageState icon={faPalette} title='No NFTs' className='py-spacer my-auto' />
  );
};
