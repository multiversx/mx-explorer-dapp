import * as React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
  Loader,
  Pager,
  Denominate,
  NetworkLink,
  ScAddressIcon,
  AccountName
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { pageHeadersAccountsStatsSelector } from 'redux/selectors/pageHeadersAccountsStats';
import { AccountType } from 'types';

import { FailedAccounts } from './FailedAccounts';
import { NoAccounts } from './NoAccounts';

export const Accounts = () => {
  const ref = React.useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const { page } = useURLSearchParams();
  const { size } = useSize();
  const { getAccounts, getAccountsCount } = useAdapter();

  const [accounts, setAccounts] = React.useState<AccountType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalAccounts, setTotalAccounts] = React.useState<number | '...'>(
    '...'
  );

  const fetchAccounts = () => {
    getAccounts(size).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setAccounts(data);
        }
        setDataReady(success);
      }
    });
  };

  const fetchAccountsCount = () => {
    getAccountsCount().then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalAccounts(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(() => {
    fetchAccounts();
    fetchAccountsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, searchParams]);

  return (
    <>
      {(dataReady === undefined ||
        Object.keys(pageHeadersAccounts).length === 0) && <Loader />}
      {dataReady === false && <FailedAccounts />}

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
                            Accounts
                          </h5>
                          <Pager
                            page={String(page)}
                            total={
                              totalAccounts !== '...'
                                ? Math.min(totalAccounts, 10000)
                                : totalAccounts
                            }
                            itemsPerPage={25}
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
                                <th>Address</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody data-testid='accountsTable'>
                              {accounts.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <ScAddressIcon
                                        initiator={account.address}
                                      />
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(
                                          account.address
                                        )}
                                        className='trim-only-sm'
                                      >
                                        <AccountName
                                          address={account.address}
                                          assets={account.assets}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
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
                          page={String(page)}
                          total={
                            totalAccounts !== '...'
                              ? Math.min(totalAccounts, 10000)
                              : totalAccounts
                          }
                          itemsPerPage={25}
                          show={accounts.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoAccounts />
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
