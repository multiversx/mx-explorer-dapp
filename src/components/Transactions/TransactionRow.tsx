import { addressIsBach32, dateFormatted, trimHash, truncate, useBach32 } from 'helpers';
import React from 'react';
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
  const { getAddress } = useBach32();

  return (
    <tr className="animated fadeIn">
      <td>
        <ScAddressIcon initiator={transaction.sender} secondInitiator={transaction.receiver} />
        <TestnetLink to={`/transactions/${transaction.hash}`} data-testid="transactionLink">
          {truncate(transaction.hash, 20)}
        </TestnetLink>
      </td>
      <td>
        <TestnetLink to={`/blocks/${transaction.blockHash}`} data-testid="blockLink">
          {truncate(transaction.blockHash, 20)}
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
          <span>{trimHash(getAddress(transaction.sender))}</span>
        ) : (
          <>
            {addressIsBach32(transaction.sender) ? (
              <TestnetLink
                to={`/address/${getAddress(transaction.sender)}`}
                data-testid="senderLink"
              >
                {trimHash(getAddress(transaction.sender))}
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
          <span>{trimHash(getAddress(transaction.receiver))}</span>
        ) : (
          <TestnetLink
            to={`/address/${getAddress(transaction.receiver)}`}
            data-testid="receiverLink"
          >
            {trimHash(getAddress(transaction.receiver))}
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
