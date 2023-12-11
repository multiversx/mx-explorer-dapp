import { PageState } from 'components';
import { faCoins } from 'icons/regular';

export const FailedTokens = () => {
  return (
    <PageState icon={faCoins} title='Unable to load Meta-ESDT Tokens' isError />
  );
};
