import * as React from 'react';
import TransactionRow, { TransactionType as TransacionInterface } from './TransactionRow';
import Pager from '../Pager';

export type TransactionType = TransacionInterface;

interface TransactionsTableType {
  transactions: TransactionType[];
  address?: string;
  totalTransactions: number | '...';
  size: number;
  title?: React.ReactNode;
  directionCol?: boolean;
}

const TransactionsTable = ({
  transactions,
  address,
  totalTransactions,
  size,
  title = (
    <>
      <h6 data-testid="title">Transactions</h6>
    </>
  ),
  directionCol = false,
}: TransactionsTableType) => {
  return (
    <div className="transactions-table">
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex align-items-center">{title}</div>
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
                  {directionCol && <th scope="col" />}
                  <th scope="col">To</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow
                    transaction={transaction}
                    key={transaction.txHash}
                    address={address}
                    directionCol={directionCol}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end">
          <Pager
            itemsPerPage={25}
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
