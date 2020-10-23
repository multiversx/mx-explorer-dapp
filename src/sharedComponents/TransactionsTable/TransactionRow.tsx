import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { addressIsBech32, dateFormatted, trimHash } from 'helpers';
import { Denominate, ScAddressIcon, ShardSpan, TestnetLink, TimeAgo } from 'sharedComponents';
import { TransactionType } from './index';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';

interface TransactionRowType {
  transaction: TransactionType;
  addressId?: string | undefined;
}

const TransactionRow = ({ transaction, addressId }: TransactionRowType) => {
  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  return (
    <tr className="animated fadeIn">
      <td>
        {(statusIs(txStatus.failed) || statusIs(txStatus.fail)) && (
          <FontAwesomeIcon icon={faTimes} className="w300 mr-1" />
        )}
        {(statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid)) && (
          <FontAwesomeIcon icon={faBan} className="w300 mr-1" />
        )}
        <TestnetLink to={`/transactions/${transaction.txHash}`} data-testid="transactionLink">
          {trimHash(transaction.txHash)}
        </TestnetLink>
      </td>
      <td>
        <span title={dateFormatted(transaction.timestamp)}>
          <TimeAgo value={transaction.timestamp} />
        </span>
      </td>
      <td>
        <TestnetLink
          to={`/transactions/shard-from/${transaction.senderShard}`}
          data-testid="shardFromLink"
        >
          <ShardSpan shardId={transaction.senderShard} />
        </TestnetLink>
        &nbsp;&gt;&nbsp;
        <TestnetLink
          to={`/transactions/shard-to/${transaction.receiverShard}`}
          data-testid="shardToLink"
        >
          <ShardSpan shardId={transaction.receiverShard} />
        </TestnetLink>
      </td>
      <td>
        <ScAddressIcon initiator={transaction.sender} />
        {addressId === transaction.sender ? (
          <span>{trimHash(transaction.sender)}</span>
        ) : (
          <>
            {addressIsBech32(transaction.sender) ? (
              <TestnetLink to={`/address/${transaction.sender}`} data-testid="senderLink">
                {trimHash(transaction.sender)}
              </TestnetLink>
            ) : (
              <ShardSpan shardId={transaction.sender} />
            )}
          </>
        )}
      </td>
      <td>
        <ScAddressIcon initiator={transaction.receiver} />
        {addressId === transaction.receiver ? (
          <span>{trimHash(transaction.receiver)}</span>
        ) : (
          <TestnetLink to={`/address/${transaction.receiver}`} data-testid="receiverLink">
            {trimHash(transaction.receiver)}
          </TestnetLink>
        )}
      </td>
      <td className="text-right">
        <Denominate value={transaction.value} />
      </td>
    </tr>
  );
};

export default TransactionRow;
