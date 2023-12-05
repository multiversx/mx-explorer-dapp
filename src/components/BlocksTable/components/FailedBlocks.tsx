import { PageState } from 'components';
import { faCube } from 'icons/regular';

export const FailedBlocks = () => {
  return (
    <PageState
      icon={faCube}
      title='Unable to load blocks'
      className='py-spacer my-auto'
      data-testid='errorScreen'
    />
  );
};
