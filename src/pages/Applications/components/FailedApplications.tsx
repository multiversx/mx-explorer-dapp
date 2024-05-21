import { PageState } from 'components';
import { faUser } from 'icons/regular';

export const FailedApplications = () => {
  return (
    <PageState icon={faUser} title='Unable to load Applications' isError />
  );
};
