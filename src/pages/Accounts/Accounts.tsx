import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import {
  Loader,
  Pager,
  PageSize,
  FormatAmount,
  AccountLink,
  TableWrapper,
  Sort
} from 'components';
import {
  useAdapter,
  useGetPage,
  useGetSearch,
  useGetSort,
  useHasGrowthWidgets
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { pageHeadersAccountsStatsSelector } from 'redux/selectors/pageHeadersAccountsStats';
import { AccountType, SortOrderEnum } from 'types';

import { FailedAccounts } from './components/FailedAccounts';
import { NoAccounts } from './components/NoAccounts';

export const Accounts = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);

  const sort = useGetSort();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getAccounts, getAccountsCount } = useAdapter();

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalAccounts, setTotalAccounts] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );

  const fetchAccounts = () => {
    setDataChanged(true);
    Promise.all([
      getAccounts({
        page,
        size,
        search,
        ...sort
      }),
      getAccountsCount({ search })
    ])
      .then(([accountsData, accountsCountData]) => {
        if (accountsData.success && accountsCountData.success) {
          setAccounts(accountsData.data);
          setTotalAccounts(accountsCountData.data);
        }
        setDataReady(accountsData.success && accountsCountData.success);
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, searchParams]);

  if (
    dataReady === undefined ||
    (hasGrowthWidgets && Object.keys(pageHeadersAccounts).length === 0)
  ) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      {dataReady === false && <FailedAccounts />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              {accounts && accounts.length > 0 ? (
                <>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <h5
                        data-testid='title'
                        className='table-title d-flex align-items-center'
                      >
                        Accounts
                      </h5>
                      <Pager
                        total={totalAccounts}
                        show={accounts.length > 0}
                        className='d-flex ms-auto me-auto me-sm-0'
                      />
                    </div>
                  </div>

                  <div className='card-body'>
                    <TableWrapper dataChanged={dataChanged}>
                      <table className='table mb-0'>
                        <thead>
                          <tr>
                            <th>Address</th>
                            <th>
                              <Sort
                                id='balance'
                                text='Balance'
                                defaultOrder={SortOrderEnum.desc}
                                defaultActive
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody data-testid='accountsTable'>
                          {accounts.map((account) => (
                            <tr key={account.address}>
                              <td>
                                <AccountLink
                                  address={account.address}
                                  assets={account?.assets}
                                  className='full-hash'
                                  linkClassName='trim-only-sm'
                                />
                              </td>
                              <td className='text-neutral-100'>
                                <FormatAmount value={account.balance} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableWrapper>
                  </div>

                  <div className='card-footer table-footer'>
                    <PageSize />
                    <Pager total={totalAccounts} show={accounts.length > 0} />
                  </div>
                </>
              ) : (
                <NoAccounts />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
