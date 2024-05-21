import { PageState } from 'components';
import { faUser } from 'icons/regular';

export const NoApplications = () => {
  return (
    <PageState
      icon={faUser}
      title='No Applications'
      className='py-spacer my-auto'
    />
  );
};
