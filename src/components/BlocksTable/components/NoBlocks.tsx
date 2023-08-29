import { PageState } from 'components';
import { faCube } from 'icons/regular';

export const NoBlocks = ({ title }: { title?: string }) => {
  return (
    <PageState
      icon={faCube}
      title={title ? title : 'No blocks'}
      className='py-spacer my-auto'
    />
  );
};
