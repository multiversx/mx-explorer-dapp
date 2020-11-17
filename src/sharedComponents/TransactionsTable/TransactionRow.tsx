import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { addressIsBech32, dateFormatted, urlBuilder } from 'helpers';
import { Denominate, ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import { ScResultType } from 'components/TransactionDetails/ScResultsList';

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
  addressId?: string;
}

const TransactionRow = ({ transaction, addressId, directionCol }: TransactionRowType) => {
  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  const directionOut = addressId === transaction.sender;
  const directionIn = addressId === transaction.receiver;
  const directionSelf = directionOut && directionIn;

  return (
    <tr className={`animated-row ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className="d-flex align-items-center">
          {(statusIs(txStatus.failed) || statusIs(txStatus.fail)) && (
            <FontAwesomeIcon icon={faTimes} className="mr-1 text-secondary" />
          )}
          {(statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid)) && (
            <FontAwesomeIcon icon={faBan} size="sm" className="mr-1 text-secondary" />
          )}

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
        <span title={dateFormatted(transaction.timestamp)}>
          <TimeAgo value={transaction.timestamp} />
        </span>
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
                  to={urlBuilder.addressDetails(transaction.sender)}
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
            <span className="badge badge-pill text-uppercase border flex-fill">
              {directionSelf ? (
                <span className="text-secondary">SELF</span>
              ) : (
                <>
                  {directionOut && <span className="text-warning">OUT</span>}
                  {directionIn && <span className="text-success">IN</span>}
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
              to={urlBuilder.addressDetails(transaction.receiver)}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <Trim text={transaction.receiver} />
            </NetworkLink>
          )}
        </div>
      </td>
      <td className="text-right">
        <Denominate value={transaction.value} />
      </td>
    </tr>
  );
};

export default TransactionRow;
