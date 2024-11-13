import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NetworkLink, DetailItem, Trim, CopyButton } from 'components';
import { faSearch } from 'icons/regular';
import { transactionsRoutes } from 'routes';
import { TransactionSCResultType } from 'types';

export const ScrDetailItem = ({
  result
}: {
  result: TransactionSCResultType;
}) => (
  <DetailItem title='SC Result Hash' noBorder>
    <div className='d-flex align-items-center'>
      <Trim text={result.hash} />
      <CopyButton className='ms-2' text={result.hash} />
      <NetworkLink
        to={`${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}`}
        className='side-action ms-2'
      >
        <FontAwesomeIcon icon={faSearch} />
      </NetworkLink>
    </div>
  </DetailItem>
);
