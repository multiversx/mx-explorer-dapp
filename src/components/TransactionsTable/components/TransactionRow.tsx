import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AccountLink,
  ScAddressIcon,
  NetworkLink,
  TimeAgo,
  Trim,
  LockedTokenAddressIcon,
  AccountName,
  TransactionIcon,
  ShardLink
} from 'components';
import { urlBuilder, getDisplayReceiver } from 'helpers';
import { faArrowRight } from 'icons/regular';
import { UITransactionType, TransferTypeEnum } from 'types';

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
  const { receiver, receiverAssets } = getDisplayReceiver(transaction);
  const directionOut = address === transaction.sender;
  const directionIn = address === receiver;
  const directionSelf = directionOut && directionIn;
  const isScResult = transaction?.type === TransferTypeEnum.SmartContractResult;

  let direction = 'Out';
  switch (true) {
    case isScResult:
      direction = 'Internal';
      break;
    case directionSelf:
      direction = 'Self';
      break;
    case directionOut:
      direction = 'Out';
      break;
    case directionIn:
      direction = 'In';
      break;
  }

  return (
    <tr className={`animated-row ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className='d-flex align-items-center hash'>
          <TransactionIcon transaction={transaction} />
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
          <ShardLink
            shard={transaction.senderShard}
            data-testid='shardFromLink'
            senderShard
            hasHighlight
          />
          <FontAwesomeIcon
            icon={faArrowRight}
            className='text-neutral-500 mx-2'
          />
          <ShardLink
            shard={transaction.receiverShard}
            data-testid='shardToLink'
            receiverShard
            hasHighlight
          />
        </div>
      </td>
      <td className='sender text-truncate'>
        {directionOut ? (
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
          <div className='d-flex'>
            <span
              className={`badge badge-outline badge-rounded badge-direction ${direction.toLowerCase()}`}
            >
              {direction.toLowerCase().replace('internal', 'int').toUpperCase()}
            </span>
          </div>
        </td>
      )}

      <td className='receiver text-truncate'>
        {directionIn ? (
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
