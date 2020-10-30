import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { addressIsBech32, dateFormatted, urlBuilder } from 'helpers';
import { Denominate, ScAddressIcon, ShardSpan, TestnetLink, TimeAgo, Trim } from 'sharedComponents';
import { TransactionType } from './index';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';

interface TransactionRowType {
  transaction: TransactionType;
  addressId?: string;
}

const TransactionRow = ({ transaction, addressId }: TransactionRowType) => {
  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  return (
    <tr className="animated fadeIn">
      <td>
        <div className="d-flex align-items-center">
          {(statusIs(txStatus.failed) || statusIs(txStatus.fail)) && (
            <FontAwesomeIcon icon={faTimes} className="mr-1 text-muted" />
          )}
          {(statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid)) && (
            <FontAwesomeIcon icon={faBan} className="mr-1 text-muted" />
          )}

          <TestnetLink
            to={`/transactions/${transaction.txHash}`}
            data-testid="transactionLink"
            className="trim-wrapper"
          >
            <Trim text={transaction.txHash} />
          </TestnetLink>
        </div>
      </td>
      <td>
        <span title={dateFormatted(transaction.timestamp)}>
          <TimeAgo value={transaction.timestamp} />
        </span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <TestnetLink
            to={urlBuilder.senderShard(transaction.senderShard)}
            data-testid="shardFromLink"
          >
            <ShardSpan shardId={transaction.senderShard} />
          </TestnetLink>
          <FontAwesomeIcon icon={faChevronRight} className="text-muted mx-2" />
          <TestnetLink
            to={urlBuilder.receiverShard(transaction.receiverShard)}
            data-testid="shardToLink"
          >
            <ShardSpan shardId={transaction.receiverShard} />
          </TestnetLink>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={transaction.sender} />
          {addressId === transaction.sender ? (
            <Trim text={transaction.sender} />
          ) : (
            <>
              {addressIsBech32(transaction.sender) ? (
                <TestnetLink
                  to={`/address/${transaction.sender}`}
                  data-testid="senderLink"
                  className="trim-wrapper"
                >
                  <Trim text={transaction.sender} />
                </TestnetLink>
              ) : (
                <ShardSpan shardId={transaction.sender} />
              )}
            </>
          )}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={transaction.receiver} />
          {addressId === transaction.receiver ? (
            <Trim text={transaction.receiver} />
          ) : (
            <TestnetLink
              to={`/address/${transaction.receiver}`}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <Trim text={transaction.receiver} />
            </TestnetLink>
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
