import * as React from 'react';
import { Denominate, ScAddressIcon, TestnetLink, TransactionStatus } from 'sharedComponents';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TransactionDetail from './TransactionDetail';
export interface PendingTransactionType {
  epoch: number;
  receiver: string;
  sender: string;
  round: number;
  type: string;
  value: string;
  hash: string;
  status: string;
  gasPrice: number;
  gasLimit: number;
  nonce: number;
}

const PendingTransaction = ({ transaction }: { transaction: PendingTransactionType }) => {
  return (
    <div className="card">
      <div className="card-body card-details">
        <TransactionDetail hideDelimiter label="Hash">
          <ScAddressIcon initiator={transaction.receiver} />
          {transaction.hash}
        </TransactionDetail>

        <TransactionDetail label="Status">
          {transaction.status === 'executed' ? (
            <TransactionStatus status="Success" />
          ) : (
            <TransactionStatus status="Pending" />
          )}
        </TransactionDetail>

        <TransactionDetail label="Timestamp">
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          <span className="text-muted">N/A</span>
        </TransactionDetail>

        <TransactionDetail label="Miniblock">
          <span className="text-muted">N/A</span>
        </TransactionDetail>

        <TransactionDetail label="From">
          {Boolean(transaction.sender) ? (
            <>
              <ScAddressIcon initiator={transaction.sender} />
              <TestnetLink to={`/address/${transaction.sender}`}>{transaction.sender}</TestnetLink>
            </>
          ) : (
            <>Metachain</>
          )}
        </TransactionDetail>

        <TransactionDetail label="To">
          <ScAddressIcon initiator={transaction.receiver} />
          <TestnetLink to={`/address/${transaction.receiver}`}>{transaction.receiver}</TestnetLink>
        </TransactionDetail>

        <TransactionDetail label="Value">
          <Denominate value={transaction.value} showLastNonZeroDecimal />
        </TransactionDetail>

        <TransactionDetail label="Transaction Fee">
          <span className="text-muted">N/A</span>
        </TransactionDetail>

        <TransactionDetail label="Gas Limit">
          <span className="text-muted">{transaction.gasLimit.toLocaleString('en')}</span>
        </TransactionDetail>

        <TransactionDetail label="Gas Used">
          <span className="text-muted">N/A</span>
        </TransactionDetail>

        <TransactionDetail label="Gas Price">
          <span className="text-muted">
            <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
          </span>
        </TransactionDetail>

        <TransactionDetail label="Nonce">
          <span className="text-muted">{transaction.nonce}</span>
        </TransactionDetail>

        <TransactionDetail label="Input Data">
          <textarea
            readOnly
            className="form-control col-lg-12 cursor-text"
            rows={2}
            defaultValue={''}
          />
        </TransactionDetail>
      </div>
    </div>
  );
};

export default PendingTransaction;
