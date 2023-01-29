import React from 'react';

import { TableWrapper } from 'components';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { TransactionsTableType } from 'types';

import { Header } from './Header';
import { NoTransactions } from './NoTransactions';
import { TransactionRow } from './TransactionRow';
import { MethodList } from './TransactionsFilters';
import { Pager } from '../Pager';

const ColSpanWrapper = ({
  children,
  directionCol
}: {
  children: React.ReactNode;
  directionCol: boolean;
}) => (
  <tr>
    <td colSpan={directionCol ? 8 : 7}>{children}</td>
  </tr>
);

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
  dataChanged = false,
  isScResultsTable = false,
  inactiveFilters
}: TransactionsTableType) => {
  return (
    <div
      className={`transactions-table ${directionCol ? 'has-direction' : ''}`}
    >
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
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
          <TableWrapper dataChanged={dataChanged}>
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
                {transactions.length > 0 ? (
                  <>
                    {transactions.map((transaction) => (
                      <TransactionRow
                        transaction={transaction}
                        key={transaction.txHash}
                        address={address}
                        directionCol={directionCol}
                        showLockedAccounts={showLockedAccounts}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <ColSpanWrapper directionCol={directionCol}>
                      {isScResultsTable ? <NoScResults /> : <NoTransactions />}
                    </ColSpanWrapper>
                  </>
                )}
              </tbody>
            </table>
          </TableWrapper>
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
