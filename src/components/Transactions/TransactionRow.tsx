import React from 'react';
import {
  ScAddressIcon,
  TestnetLink,
  Denominate,
  TimeAgo,
  ShardSpan,
} from './../../sharedComponents';
import { TransactionType } from './index';
import { truncate, dateFormatted, addressIsHash } from './../../helpers';

type PropsType = {
  transaction: TransactionType;
  addressId?: string | undefined;
};

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
          <span>{truncate(transaction.sender, 20)}</span>
        ) : (
          <>
            {addressIsHash(transaction.sender) ? (
              <TestnetLink to={`/address/${transaction.sender}`}>
                {truncate(transaction.sender, 20)}
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
          <span>{truncate(transaction.receiver, 20)}</span>
        ) : (
          <TestnetLink to={`/address/${transaction.receiver}`}>
            {truncate(transaction.receiver, 20)}
          </TestnetLink>
        )}
      </td>
      <td>
        <Denominate value={transaction.value} showAllDecimals />
      </td>
    </tr>
  );
};

export default TransactionRow;
