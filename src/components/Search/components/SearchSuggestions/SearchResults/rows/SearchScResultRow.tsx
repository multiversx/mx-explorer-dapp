import { FormatAmount, NetworkLink, Trim } from 'components';
import { urlBuilder } from 'helpers';
import { TransactionSCResultType } from 'types';

export const SearchScResultRow = ({
  scResult
}: {
  scResult?: TransactionSCResultType;
}) => {
  if (!scResult) {
    return;
  }

  const transactionLink = scResult.originalTxHash
    ? `${scResult.originalTxHash}#${scResult.hash}`
    : scResult.hash;

  return (
    <>
      <div className='search-category'>
        Txn Hash<div className='ms-auto'>Value</div>
      </div>
      <NetworkLink
        to={urlBuilder.transactionDetails(transactionLink)}
        className='search-suggestion selectable'
      >
        <div className='search-text'>
          <div className='hash trim text-truncate'>
            <Trim text={scResult.hash} />
          </div>
        </div>
        <div className='ms-auto'>
          <FormatAmount value={scResult.value} />
        </div>
      </NetworkLink>
    </>
  );
};
