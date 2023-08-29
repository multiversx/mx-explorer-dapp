import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Loader,
  Pager,
  Denominate,
  NetworkLink,
  Trim,
  ScAddressIcon,
  PageState,
  LockedTokenAddressIcon
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetPage } from 'hooks';
import { faUser } from 'icons/regular';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { AccountType } from 'types';

export const TokenDetailsAccounts = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { token } = useSelector(tokenSelector);
  const { decimals, accounts: totalAccounts } = token;
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { page, size } = useGetPage();
  const { getTokenAccounts, getTokenAccountsCount } = useAdapter();

  const { hash: tokenId } = useParams() as any;

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchAccounts = () => {
    Promise.all([
      getTokenAccounts({ tokenId, page, size }),
      getTokenAccountsCount({ tokenId })
    ]).then(([tokenAccountsData, tokenAccountsCountData]) => {
      if (ref.current !== null) {
        if (tokenAccountsData.success && tokenAccountsCountData.success) {
          setAccounts(tokenAccountsData.data);
          setAccountsCount(tokenAccountsCountData.data);
          setDataReady(true);
        }
      }
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, totalAccounts, searchParams]);

  const showAccounts = dataReady === true && accounts.length > 0;

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <TokenTabs />
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
                            <LockedTokenAddressIcon address={account.address} />
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
                        <td>
                          <Denominate
                            value={account.balance}
                            showLastNonZeroDecimal={true}
                            showLabel={false}
                            denomination={decimals}
                          />
                        </td>
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
              <Loader dataTestId='tokenAccountsLoader' />
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
