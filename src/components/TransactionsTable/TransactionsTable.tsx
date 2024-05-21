import { MAX_TRANSACTIONS_PAGE_SIZE } from 'appConstants';
import { Pager, PageSize, TableWrapper, Loader } from 'components';
import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { TransactionTableType } from 'types';

import {
  Header,
  FailedTransactions,
  NoTransactions,
  TransactionRow,
  MethodList
} from './components';

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
  token,
  totalTransactions,
  title = (
    <h5 data-testid='title' className='table-title d-flex align-items-center'>
      Live Transactions <MethodList />
    </h5>
  ),
  showDirectionCol = false,
  showLockedAccounts = false,
  dataChanged = false,
  isScResultsTable = false,
  isDataReady,
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
              total={totalTransactions}
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
                showDirectionCol={showDirectionCol}
                showLockedAccounts={showLockedAccounts}
                inactiveFilters={inactiveFilters}
              />
              <tbody>
                {isDataReady === undefined && (
                  <ColSpanWrapper showDirectionCol={showDirectionCol}>
                    <Loader />
                  </ColSpanWrapper>
                )}
                {isDataReady === false && (
                  <ColSpanWrapper showDirectionCol={showDirectionCol}>
                    {isScResultsTable ? (
                      <FailedScResults />
                    ) : (
                      <FailedTransactions />
                    )}
                  </ColSpanWrapper>
                )}

                {isDataReady === true && (
                  <>
                    {transactions.length > 0 ? (
                      <>
                        {transactions.map((transaction) => (
                          <TransactionRow
                            transaction={transaction}
                            key={transaction.txHash}
                            address={address}
                            token={token}
                            showDirectionCol={showDirectionCol}
                            showLockedAccounts={showLockedAccounts}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        <ColSpanWrapper showDirectionCol={showDirectionCol}>
                          {isScResultsTable ? (
                            <NoScResults />
                          ) : (
                            <NoTransactions />
                          )}
                        </ColSpanWrapper>
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </div>

        <div className='card-footer table-footer'>
          <PageSize maxSize={MAX_TRANSACTIONS_PAGE_SIZE} />
          <Pager total={totalTransactions} show={transactions.length > 0} />
        </div>
      </div>
    </div>
  );
};
