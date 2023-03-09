import React from 'react';

import { Pager, TableWrapper } from 'components';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { TransactionTableType } from 'types';

import { Header } from './Header';
import { NoTransactions } from './NoTransactions';
import { TransactionRow } from './TransactionRow';
import { MethodList } from './TransactionsFilters';

const ColSpanWrapper = ({
  children,
  showDirectionCol
}: {
  children: React.ReactNode;
  showDirectionCol: boolean;
}) => (
  <tr>
    <td colSpan={showDirectionCol ? 8 : 7}>{children}</td>
  </tr>
);

export const TransactionsTable = ({
  transactions,
  address,
  totalTransactions,
  size,
  title = (
    <h5 data-testid='title' className='table-title d-flex align-items-center'>
      Live Transactions <MethodList />
    </h5>
  ),
  showDirectionCol = false,
  showLockedAccounts = false,
  dataChanged = false,
  isScResultsTable = false,
  inactiveFilters
}: TransactionTableType) => {
  return (
    <div
      className={`transactions-table ${
        showDirectionCol ? 'has-direction' : ''
      }`}
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
                showDirectionCol={showDirectionCol}
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
                        showDirectionCol={showDirectionCol}
                        showLockedAccounts={showLockedAccounts}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <ColSpanWrapper showDirectionCol={showDirectionCol}>
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
