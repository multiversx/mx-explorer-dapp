import * as React from 'react';
import { Denominate, ScAddressIcon, TestnetLink, TransactionStatus } from 'sharedComponents';

export interface PendingTransactionType {
  epoch: number;
  receiver: string;
  round: number;
  type: string;
  value: string;
  hash: string;
}

const PendingTransaction = ({ transaction }: { transaction: PendingTransactionType }) => {
  return (
    <div className="card">
      <div className="card-body card-details">
        <div className="row">
          <div className="col-lg-2 card-label">Hash</div>
          <div className="col-lg-10">
            <ScAddressIcon initiator={transaction.receiver} />
            {transaction.hash}
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Status</div>
          <div className="col-lg-10">
            <TransactionStatus status={transaction.type} />
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">To</div>
          <div className="col-lg-10">
            <ScAddressIcon initiator={transaction.receiver} />
            <TestnetLink to={`/address/${transaction.receiver}`}>
              {transaction.receiver}
            </TestnetLink>
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Value</div>
          <div className="col-lg-10">
            <Denominate value={transaction.value} showLastNonZeroDecimal />
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Epoch</div>
          <div className="col-lg-10">{transaction.epoch}</div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Round</div>
          <div className="col-lg-10">{transaction.round}</div>
        </div>
      </div>
    </div>
  );
};

export default PendingTransaction;
