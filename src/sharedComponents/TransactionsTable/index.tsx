import * as React from 'react';
import TransactionRow, { TransactionType as TransacionInterface } from './TransactionRow';
import Pager from '../Pager';

export type TransactionType = TransacionInterface;

interface TransactionsTableType {
  transactions: TransactionType[];
  addressId?: string;
  totalTransactions: number | '...';
  size: number;
  withTitle?: boolean;
}

const TransactionsTable = ({
  transactions,
  addressId,
  totalTransactions,
  size,
  withTitle = false,
}: TransactionsTableType) => {
  return (
    <div className="transactions-table">
      <div className="card">
        <div className="card-header">
          {withTitle && (
            <div className="card-header-item">
              <h6 className="m-0" data-testid="title">
                Transactions
              </h6>
            </div>
          )}
          {totalTransactions > 10000 && (
            <div className="card-header-item">
              Showing last 10,000 of {totalTransactions.toLocaleString('en')} transactions
            </div>
          )}
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper animated-list">
            <table className="table" data-testid="transactionsTable">
              <thead>
                <tr>
                  <th scope="col">Txn Hash</th>
                  <th scope="col">Age</th>
                  <th scope="col">Shard</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col" className="text-right">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow
                    transaction={transaction}
                    key={transaction.txHash}
                    addressId={addressId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer">
          <Pager
            itemsPerPage={50}
            page={String(size)}
            total={
              totalTransactions !== '...' ? Math.min(totalTransactions, 10000) : totalTransactions
            }
            show={transactions.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
