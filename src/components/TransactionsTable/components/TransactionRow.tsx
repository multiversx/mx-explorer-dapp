import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AccountLink,
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  LockedTokenAddressIcon,
  AccountName,
  TransactionIcon
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
          <NetworkLink
            to={urlBuilder.senderShard(transaction.senderShard)}
            data-testid='shardFromLink'
          >
            <ShardSpan shard={transaction.senderShard} />
          </NetworkLink>
          <FontAwesomeIcon
            icon={faArrowRight}
            className='text-neutral-500 mx-2'
          />
          <NetworkLink
            to={urlBuilder.receiverShard(transaction.receiverShard)}
            data-testid='shardToLink'
          >
            <ShardSpan shard={transaction.receiverShard} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <div className='d-flex align-items-center sender'>
          {showLockedAccounts && (
            <LockedTokenAddressIcon address={transaction.sender} />
          )}

          {directionOut ? (
            <>
              <ScAddressIcon initiator={transaction.sender} />
              <AccountName
                address={transaction.sender}
                assets={transaction.senderAssets}
              />
            </>
          ) : (
            <AccountLink
              address={transaction.sender}
              assets={transaction.senderAssets}
              data-testid='senderLink'
            />
          )}
        </div>
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

      <td>
        <div className='d-flex align-items-center receiver'>
          {showLockedAccounts && <LockedTokenAddressIcon address={receiver} />}

          {directionIn ? (
            <>
              <ScAddressIcon initiator={receiver} />
              <AccountName address={receiver} assets={receiverAssets} />
            </>
          ) : (
            <AccountLink
              address={receiver}
              assets={receiverAssets}
              data-testid='receiverLink'
            />
          )}
        </div>
      </td>
      <td className='transaction-function'>
        <TransactionMethod transaction={transaction} />
      </td>
      <td className='transaction-value'>
        <TransactionValue transaction={transaction} token={token} />
      </td>
    </tr>
  );
};
