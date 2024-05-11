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
  PageSize,
  FormatAmount,
  AccountLink,
  NetworkLink,
  Sort,
  AccountName,
  Overlay,
  TimeAgo,
  Trim,
  TableWrapper,
  InfoTooltip
} from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetPage,
  useGetSort,
  useHasGrowthWidgets,
  useFetchGrowthMostUsed
} from 'hooks';
import { faBadgeCheck } from 'icons/solid';
import { activeNetworkSelector, growthMostUsedSelector } from 'redux/selectors';
import { AccountType } from 'types';
import { MostUsedApplications } from 'widgets';

import { FailedApplications } from './components/FailedApplications';
import { NoApplications } from './components/NoApplications';

export const Applications = () => {
  const [searchParams] = useSearchParams();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { isFetched: isGrowthDataFetched } = useSelector(
    growthMostUsedSelector
  );
  useFetchGrowthMostUsed();

  const sort = useGetSort();
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
        size,
        isSmartContract: true,
        withOwnerAssets: true,
        withDeployInfo: true,
        withScrCount: true,
        ...sort
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

  if (dataReady === undefined || (hasGrowthWidgets && !isGrowthDataFetched)) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      {hasGrowthWidgets && <MostUsedApplications className='mb-3' />}
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
                            <th>
                              <Sort
                                id='transfersLast24h'
                                field='Transactions / 24h'
                              />
                            </th>
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
                                    className='hash'
                                  />
                                )}
                              </td>
                              <td className='text-neutral-100'>
                                <FormatAmount value={account.balance} />
                              </td>
                              <td>
                                {account.transfersLast24h ? (
                                  formatBigNumber({
                                    value: account.transfersLast24h
                                  })
                                ) : (
                                  <>
                                    {account.scrCount &&
                                      formatBigNumber({
                                        value: account.scrCount
                                      })}
                                  </>
                                )}
                              </td>
                              <td className='text-end'>
                                {account.deployedAt ? (
                                  <div className='d-flex align-items-center justify-content-end'>
                                    <TimeAgo
                                      value={account.deployedAt}
                                      short
                                      showAgo
                                      tooltip
                                    />
                                    {account.deployTxHash && (
                                      <InfoTooltip
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
                                        persistent
                                      />
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

                  <div className='card-footer table-footer'>
                    <PageSize />
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
