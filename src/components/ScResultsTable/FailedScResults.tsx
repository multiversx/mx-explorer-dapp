import { PageState } from 'components';
import { faCode } from 'icons/regular';

export const FailedScResults = () => {
  return (
    <PageState
      icon={faCode}
      title='Unable to load Smart Contract Results'
      isError
    />
  );
};
