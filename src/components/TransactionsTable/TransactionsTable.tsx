import { MAX_TRANSACTIONS_PAGE_SIZE } from 'appConstants';
import {
  Pager,
  PageSize,
  TableWrapper,
  Loader,
  ColSpanWrapper
} from 'components';
import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { TransactionFiltersEnum, TransactionTableType } from 'types';

import {
  Header,
  FailedTransactions,
  NoTransactions,
  TransactionRow,
  MethodList
} from './components';

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
  inactiveFilters = [TransactionFiltersEnum.isRelayed]
}: TransactionTableType) => {
  const colSpan = showDirectionCol ? 8 : 7;

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
                address={address}
                showDirectionCol={showDirectionCol}
                showLockedAccounts={showLockedAccounts}
                inactiveFilters={inactiveFilters}
              />
              <tbody>
                {isDataReady === undefined && (
                  <ColSpanWrapper colSpan={colSpan}>
                    <Loader />
                  </ColSpanWrapper>
                )}
                {isDataReady === false && (
                  <ColSpanWrapper colSpan={colSpan}>
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
                        <ColSpanWrapper colSpan={colSpan}>
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
