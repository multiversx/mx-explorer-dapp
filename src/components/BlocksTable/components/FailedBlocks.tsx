import { PageState } from 'components';
import { faCube } from 'icons/regular';

export const FailedBlocks = () => {
  return <PageState icon={faCube} title='Unable to load blocks' isError />;
};
