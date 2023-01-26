import * as React from 'react';
import { TransactionsTableType } from 'types';
import { Header } from './Header';
import { TransactionRow } from './TransactionRow';
import { MethodList } from './TransactionsFilters';
import { Pager } from '../Pager';

export const TransactionsTable = ({
  transactions,
  address,
  totalTransactions,
  size,
  title = (
    <>
      <h5 data-testid='title' className='table-title d-flex align-items-center'>
        Live Transactions
      </h5>
    </>
  ),
  directionCol = false,
  showLockedAccounts = false,
  inactiveFilters
}: TransactionsTableType) => {
  return (
    <div
      className={`transactions-table ${directionCol ? 'has-direction' : ''}`}
    >
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
            {title}
            <Pager
              itemsPerPage={25}
              page={String(size)}
              total={
                totalTransactions !== '...'
                  ? Math.min(totalTransactions, 10000)
                  : totalTransactions
              }
              show={transactions.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          </div>
          <MethodList />
        </div>

        <div className='card-body'>
          <div className='table-wrapper animated-list'>
            <table
              className='table trim-size-sm mb-0'
              data-testid='transactionsTable'
            >
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

        <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={
              totalTransactions !== '...'
                ? Math.min(totalTransactions, 10000)
                : totalTransactions
            }
            show={transactions.length > 0}
          />
        </div>
      </div>
    </div>
  );
};
