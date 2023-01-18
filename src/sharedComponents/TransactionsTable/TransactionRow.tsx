import React from 'react';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder, getReceiverAssets } from 'helpers';
import { UITransactionType, TransferTypeEnum } from 'helpers/types';
import {
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  LockedTokenAddressIcon,
  AccountName,
} from 'sharedComponents';
import TransactionIcon from '../TransactionsTable/TransactionIcon';
import TransactionMethod from '../TransactionsTable/TransactionMethod';
import TransactionValue from '../TransactionsTable/TransactionValue';

export interface TransactionRowType {
  transaction: UITransactionType;
  directionCol?: boolean;
  address?: string;
  showLockedAccounts?: boolean;
}

const TransactionRow = ({
  transaction,
  address,
  directionCol,
  showLockedAccounts,
}: TransactionRowType) => {
  let receiver = transaction.receiver;
  if (transaction?.action?.arguments?.receiver) {
    receiver = transaction.action.arguments.receiver;
  }
  const directionOut = address === transaction.sender;
  const directionIn = address === receiver;
  const directionSelf = directionOut && directionIn;
  const isScResult = transaction?.type === TransferTypeEnum.SmartContractResult;
  const receiverAssets = getReceiverAssets(transaction);

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
    <tr className={`animated-row trim-size-sm ${transaction.isNew ? 'new' : ''}`}>
      <td>
        <div className="d-flex align-items-center">
          <TransactionIcon transaction={transaction} />
          <NetworkLink
            to={urlBuilder.transactionDetails(
              transaction.originalTxHash
                ? `${transaction.originalTxHash}#${transaction.txHash}`
                : transaction.txHash
            )}
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
        <div className="d-flex align-items-center sender">
          {showLockedAccounts && <LockedTokenAddressIcon address={transaction.sender} />}
          <ScAddressIcon initiator={transaction.sender} />
          {directionOut ? (
            <AccountName address={transaction.sender} assets={transaction.senderAssets} />
          ) : (
            <>
              {addressIsBech32(transaction.sender) ? (
                <NetworkLink
                  to={urlBuilder.accountDetails(transaction.sender)}
                  data-testid="senderLink"
                  className="trim-wrapper"
                >
                  <AccountName address={transaction.sender} assets={transaction.senderAssets} />
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
        <div className="d-flex align-items-center receiver">
          {showLockedAccounts && <LockedTokenAddressIcon address={receiver} />}
          <ScAddressIcon initiator={receiver} />
          {directionIn ? (
            <AccountName address={receiver} assets={receiverAssets} />
          ) : (
            <NetworkLink
              to={urlBuilder.accountDetails(receiver)}
              data-testid="receiverLink"
              className="trim-wrapper"
            >
              <AccountName address={receiver} assets={receiverAssets} />
            </NetworkLink>
          )}
        </div>
      </td>
      <td className="transaction-function">
        <TransactionMethod transaction={transaction} />
      </td>
      <td className="transaction-value">
        <TransactionValue transaction={transaction} />
      </td>
    </tr>
  );
};

export default TransactionRow;
