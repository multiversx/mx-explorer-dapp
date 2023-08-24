import { PageState } from 'components';
import { faCoins } from 'icons/regular';

export const NoCollections = () => {
  return (
    <PageState
      icon={faCoins}
      title='No Collections'
      className='py-spacer my-auto'
    />
  );
};
