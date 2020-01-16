import React from 'react';
import { addressIsHash, dateFormatted, trimHash, truncate } from './../../helpers';
import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
} from './../../sharedComponents';
import { TransactionType } from './index';

interface PropsType {
  transaction: TransactionType;
  addressId?: string | undefined;
}

const TransactionRow: React.FC<PropsType> = ({ transaction, addressId }) => {
  return (
    <tr className="animated fadeIn">
      <td>
        <TestnetLink to={`/transactions/${transaction.hash}`}>
          {truncate(transaction.hash, 20)}
        </TestnetLink>
      </td>
      <td>
        <TestnetLink to={`/blocks/${transaction.blockHash}`}>
          {truncate(transaction.blockHash, 20)}
        </TestnetLink>
      </td>
      <td>
        <span title={dateFormatted(transaction.timestamp)}>
          <TimeAgo value={transaction.timestamp} />
        </span>
      </td>
      <td>
        <TestnetLink to={`/transactions/shard-from/${transaction.senderShard}`}>
          {transaction.senderShard}
        </TestnetLink>
        &nbsp;&gt;&nbsp;
        <TestnetLink to={`/transactions/shard-to/${transaction.receiverShard}`}>
          {transaction.receiverShard}
        </TestnetLink>
      </td>
      <td>
        <ScAddressIcon value={transaction.sender} />
        {addressId === transaction.sender ? (
          <span>{trimHash(transaction.sender)}</span>
        ) : (
          <>
            {addressIsHash(transaction.sender) ? (
              <TestnetLink to={`/address/${transaction.sender}`}>
                {trimHash(transaction.sender)}
              </TestnetLink>
            ) : (
              <ShardSpan shardId={transaction.sender} />
            )}
          </>
        )}
      </td>
      <td>
        <ScAddressIcon value={transaction.receiver} />
        {addressId === transaction.receiver ? (
          <span>{trimHash(transaction.receiver)}</span>
        ) : (
          <TestnetLink to={`/address/${transaction.receiver}`}>
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
