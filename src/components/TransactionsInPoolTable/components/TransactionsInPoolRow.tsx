import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import {
  NetworkLink,
  Trim,
  AccountLink,
  FormatAmount,
  ShardLink
} from 'components';
import { urlBuilder } from 'helpers';
import { useIsSovereign } from 'hooks';
import { faArrowRight } from 'icons/regular';
import { UITransactionInPoolType } from 'types';

import { TransactionInPoolTypeBadge } from './TransactionInPoolTypeBadge';

export interface TransactionInPoolRowUIType {
  transaction: UITransactionInPoolType;
}

export const TransactionInPoolRow = ({
  transaction
}: TransactionInPoolRowUIType) => {
  const {
    isNew,
    txHash,
    sender,
    receiver,
    receiverUsername,
    type,
    value,
    senderShard,
    receiverShard
  } = transaction;

  const isSovereign = useIsSovereign();

  return (
    <tr className={classNames('animated-row', { new: isNew })}>
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
      <td>
        <div className='d-flex align-items-center'>
          {isSovereign && senderShard === receiverShard ? (
            <>Local Transaction</>
          ) : (
            <>
              <ShardLink
                shard={senderShard}
                data-testid='shardFromLink'
                transactionSenderShard
                hasHighlight
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className='text-neutral-500 mx-2'
              />
              <ShardLink
                shard={receiverShard}
                data-testid='shardToLink'
                transactionReceiverShard
                hasHighlight
              />
            </>
          )}
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
