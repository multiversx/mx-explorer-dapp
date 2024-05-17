import { NetworkLink, Trim, AccountLink, FormatAmount } from 'components';
import { urlBuilder } from 'helpers';
import { TransactionInPoolType } from 'types';

import { TransactionInPoolTypeBadge } from './TransactionInPoolTypeBadge';

export interface TransactionInPoolRowUIType {
  transaction: TransactionInPoolType;
}

export const TransactionInPoolRow = ({
  transaction
}: TransactionInPoolRowUIType) => {
  const { txHash, sender, receiver, receiverUsername, type, value } =
    transaction;

  return (
    <tr className='animated-row'>
      <td>
        <div className='d-flex align-items-center hash'>
          <NetworkLink
            to={urlBuilder.transactionInPoolDetails(txHash)}
            data-testid='transactionLink'
            className='trim-wrapper'
          >
            <Trim text={txHash} />
          </NetworkLink>
        </div>
      </td>

      <td className='sender text-truncate'>
        <AccountLink address={sender} data-testid='receiverLink' hasHighlight />
      </td>

      <td className='receiver text-truncate'>
        <AccountLink
          address={receiver}
          username={receiverUsername}
          data-testid='receiverLink'
          hasHighlight
        />
      </td>
      <td className='transaction-type'>
        <TransactionInPoolTypeBadge type={type} hasHighlight />
      </td>
      <td className='transaction-value'>
        <FormatAmount value={value} />
      </td>
    </tr>
  );
};
