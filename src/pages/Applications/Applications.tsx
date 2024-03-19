import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as DefaultImage } from 'assets/img/default-icon.svg';
import {
  Loader,
  Pager,
  Denominate,
  AccountLink,
  NetworkLink,
  Sort,
  AccountName,
  Overlay,
  TimeAgo,
  Trim,
  TableWrapper
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useGetPage, useGetSort, useIsMainnet } from 'hooks';
import { faInfoCircle } from 'icons/regular';
import { faBadgeCheck } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';
import { pageHeadersAccountsStatsSelector } from 'redux/selectors/pageHeadersAccountsStats';
import { AccountType } from 'types';
import { MostUsedApplications } from 'widgets';

import { FailedApplications } from './components/FailedApplications';
import { NoApplications } from './components/NoApplications';

export const Applications = () => {
  const [searchParams] = useSearchParams();
  const isMainnet = useIsMainnet();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);

  const { sort, order } = useGetSort();
  const { page, size } = useGetPage();
  const { getAccounts, getAccountsCount } = useAdapter();

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalAccounts, setTotalAccounts] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );

  const fetchApplications = () => {
    setDataChanged(true);
    Promise.all([
      getAccounts({
        page,
        size: size ?? 15,
        sort,
        order,
        isSmartContract: true,
        withOwnerAssets: true,
        withDeployInfo: true,
        withScrCount: true
      }),
      getAccountsCount({ isSmartContract: true })
    ])
      .then(([applicationsData, applicationsCountData]) => {
        if (applicationsData.success && applicationsCountData.success) {
          setAccounts(applicationsData.data);
          setTotalAccounts(applicationsCountData.data);
        }
        setDataReady(applicationsData.success && applicationsCountData.success);
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [activeNetworkId, searchParams]);

  return (
    <div className='container page-content'>
      {isMainnet && <MostUsedApplications className='mb-3' />}
      {(dataReady === undefined ||
        (isMainnet && Object.keys(pageHeadersAccounts).length === 0)) && (
        <Loader />
      )}
      {dataReady === false && <FailedApplications />}
      {dataReady === true && (
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              {accounts && accounts.length > 0 ? (
                <>
                  <div className='card-header pb-0'>
                    <h5 className='mb-0'>Browse all deployed apps</h5>
                  </div>
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
                    <TableWrapper dataChanged={dataChanged}>
                      <table className='table mb-0'>
                        <thead>
                          <tr>
                            <th>Name/Address</th>
                            <th>Owner</th>
                            <th>
                              <Sort id='balance' field='Balance' />
                            </th>
                            <th className='text-end'>Transactions</th>
                            <th className='text-end'>Deployed</th>
                          </tr>
                        </thead>
                        <tbody data-testid='accountsTable'>
                          {accounts.map((account, i) => (
                            <tr key={account.address}>
                              <td>
                                <NetworkLink
                                  to={urlBuilder.accountDetails(
                                    account.address
                                  )}
                                  data-testid={`applicationLink${i}`}
                                  className='d-flex align-items-center trim-wrapper gap-2 hash hash-xxl'
                                >
                                  {account.assets?.iconSvg ||
                                  account.assets?.iconPng ? (
                                    <img
                                      src={
                                        account.assets?.iconSvg ||
                                        account.assets?.iconPng
                                      }
                                      alt={account.assets?.name}
                                      className='side-icon side-icon-md-large'
                                    />
                                  ) : (
                                    <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                                      <DefaultImage />
                                    </div>
                                  )}
                                  <AccountName
                                    address={account.address}
                                    assets={account.assets}
                                  />
                                  {account.isVerified && (
                                    <Overlay title='Verified'>
                                      <FontAwesomeIcon
                                        icon={faBadgeCheck}
                                        size='sm'
                                        className='text-primary'
                                      />
                                    </Overlay>
                                  )}
                                </NetworkLink>
                              </td>
                              <td>
                                {account?.ownerAddress && (
                                  <AccountLink
                                    address={account.ownerAddress}
                                    assets={account.ownerAssets}
                                  />
                                )}
                              </td>
                              <td className='text-neutral-100'>
                                <Denominate value={account.balance} />
                              </td>
                              <td className='text-end'>
                                {account.scrCount && (
                                  <>
                                    {new BigNumber(account.scrCount).toFormat()}
                                  </>
                                )}
                              </td>
                              <td className='text-end'>
                                {account.deployedAt ? (
                                  <div className='d-flex align-items-center justify-content-end gap-2'>
                                    <TimeAgo
                                      value={account.deployedAt}
                                      short
                                      showAgo
                                      tooltip
                                    />
                                    {account.deployTxHash && (
                                      <Overlay
                                        title={
                                          <>
                                            <span className='text-neutral-400'>
                                              Deploy Transaction:
                                            </span>
                                            <NetworkLink
                                              to={urlBuilder.transactionDetails(
                                                account.deployTxHash
                                              )}
                                              data-testid='upgradeTxHashLink'
                                              className='trim-wrapper'
                                            >
                                              <Trim
                                                text={account.deployTxHash}
                                              />
                                            </NetworkLink>
                                          </>
                                        }
                                        className='cursor-context'
                                        persistent
                                      >
                                        <FontAwesomeIcon
                                          icon={faInfoCircle}
                                          className='text-neutral-500'
                                        />
                                      </Overlay>
                                    )}
                                  </div>
                                ) : (
                                  <span className='text-neutral-400'>N/A</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableWrapper>
                  </div>

                  <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                    <Pager total={totalAccounts} show={accounts.length > 0} />
                  </div>
                </>
              ) : (
                <NoApplications />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
