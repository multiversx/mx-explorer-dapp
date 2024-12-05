import { ELLIPSIS } from 'appConstants';
import {
  Pager,
  PageSize,
  TableWrapper,
  Loader,
  PageState,
  PulsatingLed
} from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { useGetTransactionInPoolFilters } from 'hooks';
import { faCode, faExchangeAlt } from 'icons/regular';
import {
  UITransactionInPoolType,
  TransactionFiltersEnum,
  TransactionInPoolTypeEnum
} from 'types';

import { TransactionsInPoolHeader, TransactionInPoolRow } from './components';

export interface TransactionsInPoolTableUIType {
  transactionsInPool: UITransactionInPoolType[];
  totalTransactionsInPool: number | typeof ELLIPSIS;
  title?: React.ReactNode;
  dataChanged?: boolean;
  isDataReady?: boolean;
  inactiveFilters?: TransactionFiltersEnum[];
}

const ColSpanWrapper = ({ children }: { children: React.ReactNode }) => (
  <tr>
    <td colSpan={7}>{children}</td>
  </tr>
);

export const TransactionsInPoolTable = ({
  transactionsInPool,
  totalTransactionsInPool,
  title = (
    <h5 data-testid='title' className='table-title d-flex align-items-center'>
      {formatBigNumber({ value: totalTransactionsInPool })}{' '}
      {getStringPlural(totalTransactionsInPool, {
        string: 'Transaction'
      })}{' '}
      In Pool <PulsatingLed className='ms-2 mt-1' />
    </h5>
  ),
  dataChanged = false,
  isDataReady,
  inactiveFilters
}: TransactionsInPoolTableUIType) => {
  const { type } = useGetTransactionInPoolFilters();
  return (
    <div className='transactions-table transactions-in-pool-table'>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            {title}
            <Pager
              total={totalTransactionsInPool}
              show={transactionsInPool.length > 0}
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
              <TransactionsInPoolHeader inactiveFilters={inactiveFilters} />
              <tbody>
                {isDataReady === undefined && (
                  <ColSpanWrapper>
                    <Loader />
                  </ColSpanWrapper>
                )}
                {isDataReady === false && (
                  <ColSpanWrapper>
                    <PageState
                      icon={faExchangeAlt}
                      title={`No ${type ? `${type} ` : ''}Transactions in Pool`}
                      className='py-spacer my-auto'
                    />
                  </ColSpanWrapper>
                )}

                {isDataReady === true && (
                  <>
                    {transactionsInPool.length > 0 ? (
                      <>
                        {transactionsInPool.map((transactionInPool, key) => (
                          <TransactionInPoolRow
                            transaction={transactionInPool}
                            key={`${transactionInPool.txHash}-${key}`}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        <ColSpanWrapper>
                          <PageState
                            icon={faCode}
                            title={`No  ${
                              type && type !== TransactionInPoolTypeEnum.All
                                ? `${type} `
                                : ''
                            }Transactions in Pool`}
                            className='py-spacer my-auto'
                          />
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
          <PageSize />
          <Pager
            total={totalTransactionsInPool}
            show={transactionsInPool.length > 0}
          />
        </div>
      </div>
    </div>
  );
};
