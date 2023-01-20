import * as React from 'react';
import TransactionRow from './TransactionRow';
import { MethodList } from './TransactionsFilters';
import Pager from '../Pager';
import { TransactionsTableType } from 'helpers/types';

import { Header } from './Header';

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
  showLockedAccounts = false,
  inactiveFilters,
}: TransactionsTableType) => {
  return (
    <div className={`transactions-table ${directionCol ? 'has-direction' : ''}`}>
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <div>{title}</div>

            <div className="d-none d-sm-flex">
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={
                  totalTransactions !== '...'
                    ? Math.min(totalTransactions, 10000)
                    : totalTransactions
                }
                show={transactions.length > 0}
                hasTestId={false}
              />
            </div>
          </div>
          <MethodList />
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper animated-list">
            <table className="table trim-size-sm" data-testid="transactionsTable">
              <Header
                transactions={transactions}
                totalTransactions={totalTransactions}
                size={size}
                directionCol={directionCol}
                showLockedAccounts={showLockedAccounts}
                inactiveFilters={inactiveFilters}
              />
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow
                    transaction={transaction}
                    key={transaction.txHash}
                    address={address}
                    directionCol={directionCol}
                    showLockedAccounts={showLockedAccounts}
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
