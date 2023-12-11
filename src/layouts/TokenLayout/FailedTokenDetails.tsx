import { PageState } from 'components';
import { faCoins } from 'icons/regular';

export const FailedTokenDetails = ({
  tokenId
}: {
  tokenId: string | undefined;
}) => {
  return (
    <PageState
      icon={faCoins}
      title='Unable to locate this token'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{tokenId}</span>
        </div>
      }
      isError
    />
  );
};
