import { PageState } from 'components';
import { faCode } from 'icons/regular';

export const NoScResults = () => {
  return (
    <PageState
      icon={faCode}
      title='No Smart Contract Results'
      className='py-spacer my-auto'
    />
  );
};
