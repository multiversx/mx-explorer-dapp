import { PageState } from 'components';
import { faCube } from 'icons/regular';

interface MiniBlockNotFoundType {
  miniBlockHash: string | undefined;
}

export const MiniBlockNotFound = ({ miniBlockHash }: MiniBlockNotFoundType) => {
  return (
    <PageState
      icon={faCube}
      title='Unable to locate this miniblock hash'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{miniBlockHash}</span>
        </div>
      }
      isError
    />
  );
};
