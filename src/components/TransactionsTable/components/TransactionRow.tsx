import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  AccountLink,
  ScAddressIcon,
  NetworkLink,
  TimeAgo,
  Trim,
  LockedTokenAddressIcon,
  AccountName,
  TransactionIcons,
  ShardLink
} from 'components';
import {
  urlBuilder,
  getDisplayReceiver,
  getTransactionDirection
} from 'helpers';
import { useIsSovereign } from 'hooks';
import { faArrowRight } from 'icons/regular';
import { TransactionDirectionEnum, UITransactionType } from 'types';

import { TransactionDirection } from './TransactionDirection';
import { TransactionMethod } from './TransactionMethod';
import { TransactionValue } from './TransactionValue';

export interface TransactionRowType {
  transaction: UITransactionType;
  showDirectionCol?: boolean;
  address?: string;
  token?: string;
  showLockedAccounts?: boolean;
}

export const TransactionRow = ({
  transaction,
  address,
  token,
  showDirectionCol,
  showLockedAccounts
}: TransactionRowType) => {
  const isSovereign = useIsSovereign();
  const { receiver, receiverAssets } = getDisplayReceiver(transaction);
  const direction = getTransactionDirection({ transaction, address });

  return (
    <tr className={`animated-row ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className='d-flex align-items-center hash'>
          <TransactionIcons transaction={transaction} />
          <NetworkLink
            to={urlBuilder.transactionDetails(
              transaction.originalTxHash
                ? `${transaction.originalTxHash}#${transaction.txHash}`
                : transaction.txHash
            )}
            data-testid='transactionLink'
            className='trim-wrapper'
          >
            <Trim text={transaction.txHash} />
          </NetworkLink>
        </div>
      </td>
      <td className='text-neutral-400'>
        <TimeAgo value={transaction.timestamp} short tooltip />
      </td>
      <td>
        <div className='d-flex align-items-center'>
          {isSovereign &&
          transaction.senderShard === transaction.receiverShard ? (
            <>Local Transaction</>
          ) : (
            <>
              <ShardLink
                shard={transaction.senderShard}
                data-testid='shardFromLink'
                transactionSenderShard
                hasHighlight
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className='text-neutral-500 mx-2'
              />
              <ShardLink
                shard={transaction.receiverShard}
                data-testid='shardToLink'
                transactionReceiverShard
                hasHighlight
              />
            </>
          )}
        </div>
      </td>
      <td className='sender text-truncate'>
        {direction === TransactionDirectionEnum.out ? (
          <div className='d-flex align-items-center'>
            <ScAddressIcon initiator={transaction.sender} />
            <AccountName
              address={transaction.sender}
              assets={transaction.senderAssets}
              className='text-neutral-400'
            />
            {showLockedAccounts && (
              <LockedTokenAddressIcon address={transaction.sender} />
            )}
          </div>
        ) : (
          <AccountLink
            address={transaction.sender}
            assets={transaction.senderAssets}
            showLockedAccounts={showLockedAccounts}
            data-testid='senderLink'
            hasHighlight
          />
        )}
      </td>
      {showDirectionCol === true && (
        <td>
          <TransactionDirection
            transaction={transaction}
            address={address}
            hasHighlight
          />
        </td>
      )}

      <td className='receiver text-truncate'>
        {direction === TransactionDirectionEnum.in ? (
          <div className='d-flex align-items-center'>
            <ScAddressIcon initiator={receiver} />
            <AccountName
              address={receiver}
              assets={receiverAssets}
              className='text-neutral-400'
            />
            {showLockedAccounts && (
              <LockedTokenAddressIcon address={receiver} />
            )}
          </div>
        ) : (
          <AccountLink
            address={receiver}
            assets={receiverAssets}
            showLockedAccounts={showLockedAccounts}
            data-testid='receiverLink'
            hasHighlight
          />
        )}
      </td>
      <td className='transaction-function'>
        <TransactionMethod transaction={transaction} hasHighlight />
      </td>
      <td className='transaction-value'>
        <TransactionValue transaction={transaction} token={token} />
      </td>
    </tr>
  );
};
