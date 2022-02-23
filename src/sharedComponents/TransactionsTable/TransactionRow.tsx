import React from 'react';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder } from 'helpers';
import { UITransactionType } from 'helpers/types';
import { ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';
import TransactionIcon from '../TransactionsTable/TransactionIcon';
import TransactionMethod from '../TransactionsTable/TransactionMethod';
import TransactionValue from '../TransactionsTable/TransactionValue';

export interface TransactionRowType {
  transaction: UITransactionType;
  directionCol?: boolean;
  address?: string;
}

const TransactionRow = ({ transaction, address, directionCol }: TransactionRowType) => {
  let receiver = transaction.receiver;
  if (transaction.action && transaction.action.arguments?.receiver) {
    receiver = transaction.action.arguments.receiver;
  }
  const directionOut = address === transaction.sender;
  const directionIn = address === receiver;
  const directionSelf = directionOut && directionIn;
  const isScResult = transaction?.type === 'SmartContractResult';

  let direction = '';
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
    <tr className={`animated-row trim-size-sm ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className="d-flex align-items-center">
          <TransactionIcon transaction={transaction} />
          <NetworkLink
            to={`/transactions/${
              transaction.originalTxHash
                ? `${transaction.originalTxHash}#${transaction.txHash}`
                : transaction.txHash
            }`}
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
          <FontAwesomeIcon icon={faArrowRight} className="text-secondary mx-2" />
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
            <span className={`direction-badge ${direction.toLowerCase()}`}>
              {direction.toUpperCase()}
            </span>
          </div>
        </td>
      )}

      <td>
        <div className="d-flex align-items-center">
          <ScAddressIcon initiator={receiver} />
          {directionIn ? (
            <Trim text={receiver} />
          ) : (
            <NetworkLink
              to={urlBuilder.accountDetails(receiver)}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <Trim text={receiver} />
            </NetworkLink>
          )}
        </div>
      </td>
      <td className="transaction-function">
        <TransactionMethod transaction={transaction} />
      </td>
      <td>
        <TransactionValue transaction={transaction} />
      </td>
    </tr>
  );
};

export default TransactionRow;
