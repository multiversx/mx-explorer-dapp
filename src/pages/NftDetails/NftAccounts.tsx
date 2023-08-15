import React, { useEffect, useRef, useState } from 'react';
import { faUser } from 'icons/regular';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Loader,
  Pager,
  NetworkLink,
  Trim,
  ScAddressIcon,
  PageState
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { NftTabs } from 'layouts/NftLayout/NftTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { AccountType } from 'types';

export const NftAccounts = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { page, size } = useGetPage();
  const { getNftAccounts, getNftAccountsCount } = useAdapter();

  const { hash: identifier } = useParams() as any;

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchAccounts = () => {
    Promise.all([
      getNftAccounts({ identifier, page, size }),
      getNftAccountsCount({ identifier })
    ]).then(([nftAccountsData, nftAccountsCountData]) => {
      if (ref.current !== null) {
        if (nftAccountsData.success && nftAccountsCountData.success) {
          setAccounts(nftAccountsData.data);
          setAccountsCount(nftAccountsCountData.data);
          setDataReady(true);
        }
      }
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, searchParams]);

  const showAccounts = dataReady === true && accounts.length > 0;

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <NftTabs />
            <Pager
              total={accountsCount}
              show={accounts.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          </div>
        </div>
        {showAccounts ? (
          <>
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
                            <ScAddressIcon initiator={account.address} />
                            <NetworkLink
                              to={urlBuilder.accountDetails(account.address)}
                              className='trim-only-sm'
                            >
                              <Trim
                                text={account.address}
                                dataTestId={`accountLink${i}`}
                              />
                            </NetworkLink>
                          </div>
                        </td>
                        <td>{new BigNumber(account.balance).toFormat()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
              <Pager total={accountsCount} show={accounts.length > 0} />
            </div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader dataTestId='nftAccountsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title='Unable to load Accounts'
                className='py-spacer my-auto'
                dataTestId='errorScreen'
              />
            )}
            {dataReady === true && accounts.length === 0 && (
              <PageState
                icon={faUser}
                title='No Accounts'
                className='py-spacer my-auto'
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
