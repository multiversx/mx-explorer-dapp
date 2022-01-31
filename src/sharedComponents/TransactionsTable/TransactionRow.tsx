import React from 'react';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder } from 'helpers';
import { UITransactionType, TxActionsEnum, TxActionCategoryEnum } from 'helpers/types';
import { ScAddressIcon, ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';
import TransactionIcon from '../TransactionsTable/TransactionIcon';
import TransactionFunction from '../TransactionsTable/TransactionFunction';
import TransactionValue from '../TransactionsTable/TransactionValue';

export interface TransactionRowType {
  transaction: UITransactionType;
  directionCol?: boolean;
  address?: string;
}

const TransactionRow = ({ transaction, address, directionCol }: TransactionRowType) => {
  let receiver = transaction.receiver;
  if (
    transaction.action &&
    transaction.action.category === TxActionCategoryEnum.esdtNft &&
    transaction.action.name === TxActionsEnum.transfer &&
    transaction.action.arguments?.receiver
  ) {
    receiver = transaction.action.arguments.receiver;
  }
  const directionOut = address === transaction.sender;
  const directionIn = address === receiver;
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
        <TransactionFunction transaction={transaction} />
      </td>
      <td>
        <TransactionValue transaction={transaction} />
      </td>
    </tr>
  );
};

export default TransactionRow;
