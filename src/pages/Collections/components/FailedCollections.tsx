import { PageState } from 'components';
import { faCoins } from 'icons/regular';

export const FailedCollections = () => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to load Collections'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
