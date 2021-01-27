import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { addressIsBech32, urlBuilder } from 'helpers';
import { Denominate, ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';
import { ScResultType } from 'components/TransactionDetails/ScResultsList';
import TransactionIcon from '../TransactionsTable/TransactionIcon';

export interface TransactionType {
  txHash: string;
  receiver: string;
  receiverShard: number;
  sender: string;
  senderShard: number;
  status: string;
  timestamp: number;
  value: string;
  blockHash?: string;
  data?: string;
  gasLimit?: number;
  gasPrice?: number;
  gasUsed?: number;
  miniBlockHash?: string;
  nonce?: number;
  round?: number;
  signature?: string;
  scResults?: ScResultType[];
  isNew?: boolean; // UI flag
}

interface TransactionRowType {
  transaction: TransactionType;
  directionCol?: boolean;
  address?: string;
}

const TransactionRow = ({ transaction, address, directionCol }: TransactionRowType) => {
  const directionOut = address === transaction.sender;
  const directionIn = address === transaction.receiver;
  const directionSelf = directionOut && directionIn;

  return (
    <tr className={`animated-row ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className="d-flex align-items-center">
          <TransactionIcon transaction={transaction} />
          <NetworkLink
            to={`/transactions/${transaction.txHash}`}
            data-testid="transactionLink"
            className="trim-wrapper"
          >
            <Trim text={transaction.txHash} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <TimeAgo value={transaction.timestamp} short tooltip />
      </td>
      <td>
        <div className="d-flex align-items-center">
          <NetworkLink
            to={urlBuilder.senderShard(transaction.senderShard)}
            data-testid="shardFromLink"
          >
            <ShardSpan shard={transaction.senderShard} />
          </NetworkLink>
          <FontAwesomeIcon icon={faChevronRight} className="text-secondary mx-2" />
          <NetworkLink
            to={urlBuilder.receiverShard(transaction.receiverShard)}
            data-testid="shardToLink"
          >
            <ShardSpan shard={transaction.receiverShard} />
          </NetworkLink>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={transaction.sender} />
          {directionOut ? (
            <Trim text={transaction.sender} />
          ) : (
            <>
              {addressIsBech32(transaction.sender) ? (
                <NetworkLink
                  to={urlBuilder.accountDetails(transaction.sender)}
                  data-testid="senderLink"
                  className="trim-wrapper"
                >
                  <Trim text={transaction.sender} />
                </NetworkLink>
              ) : (
                <ShardSpan shard={transaction.sender} />
              )}
            </>
          )}
        </div>
      </td>
      {directionCol === true && (
        <td>
          <div className="d-flex">
            <span
              className={`direction-badge ${directionSelf ? 'self' : directionOut ? 'out' : 'in'}`}
            >
              {directionSelf ? (
                <>SELF</>
              ) : (
                <>
                  {directionOut && <>OUT</>}
                  {directionIn && <>IN</>}
                </>
              )}
            </span>
          </div>
        </td>
      )}

      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={transaction.receiver} />
          {directionIn ? (
            <Trim text={transaction.receiver} />
          ) : (
            <NetworkLink
              to={urlBuilder.accountDetails(transaction.receiver)}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <Trim text={transaction.receiver} />
            </NetworkLink>
          )}
        </div>
      </td>
      <td>
        <Denominate value={transaction.value} />
      </td>
    </tr>
  );
};

export default TransactionRow;
