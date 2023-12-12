import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { Loader, Pager, Denominate, AccountLink, Sort } from 'components';
import { useAdapter, useGetPage, useGetSort, useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { pageHeadersAccountsStatsSelector } from 'redux/selectors/pageHeadersAccountsStats';
import { AccountType } from 'types';

import { FailedApplications } from './components/FailedApplications';
import { NoApplications } from './components/NoApplications';

export const Applications = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const isMainnet = useIsMainnet();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);

  const { sort, order } = useGetSort();
  const { page, size } = useGetPage();
  const { getAccounts, getAccountsCount } = useAdapter();

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalAccounts, setTotalAccounts] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );

  const fetchAccounts = () => {
    getAccounts({ page, size, sort, order, isSmartContract: true }).then(
      ({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            setAccounts(data);
          }
          setDataReady(success);
        }
      }
    );
  };

  const fetchAccountsCount = () => {
    getAccountsCount({ isSmartContract: true }).then(
      ({ data: count, success }) => {
        if (ref.current !== null && success) {
          setTotalAccounts(count);
        }
      }
    );
  };

  useEffect(() => {
    fetchAccounts();
    fetchAccountsCount();
  }, [activeNetworkId, searchParams]);

  return (
    <>
      {(dataReady === undefined ||
        (isMainnet && Object.keys(pageHeadersAccounts).length === 0)) && (
        <Loader />
      )}
      {dataReady === false && <FailedApplications />}

      <div ref={ref}>
        {dataReady === true && (
          <div className='container page-content'>
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
                            {totalAccounts !== ELLIPSIS
                              ? `${new BigNumber(totalAccounts).toFormat()} `
                              : ''}
                            Applications
                          </h5>
                          <Pager
                            total={totalAccounts}
                            show={accounts.length > 0}
                            className='d-flex ms-auto me-auto me-sm-0'
                          />
                        </div>
                      </div>

                      <div className='card-body'>
                        <div className='table-wrapper animated-list'>
                          <table className='table mb-0'>
                            <thead>
                              <tr>
                                <th>Name/Address</th>
                                <th>Owner</th>
                                <th>
                                  <Sort id='balance' field='Balance' />
                                </th>
                              </tr>
                            </thead>
                            <tbody data-testid='accountsTable'>
                              {accounts.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <AccountLink
                                      address={account.address}
                                      assets={account?.assets}
                                      className='full-hash'
                                    />
                                  </td>
                                  <td>
                                    {account?.ownerAddress && (
                                      <AccountLink
                                        address={account.ownerAddress}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Denominate value={account.balance} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          total={totalAccounts}
                          show={accounts.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoApplications />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
