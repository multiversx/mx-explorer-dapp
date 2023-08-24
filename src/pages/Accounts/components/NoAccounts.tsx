import { PageState } from 'components';
import { faUser } from 'icons/regular';

export const NoAccounts = () => {
  return (
    <PageState
      icon={faUser}
      title='No accounts'
      className='py-spacer my-auto'
    />
  );
};
