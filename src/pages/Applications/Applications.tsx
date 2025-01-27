import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
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
  useFetchGrowthMostUsed,
  useIsMainnet,
  useGetSearch
} from 'hooks';
import { faBadgeCheck } from 'icons/solid';
import { activeNetworkSelector, growthMostUsedSelector } from 'redux/selectors';
import { AccountType, SortOrderEnum } from 'types';
import { MostUsedApplications } from 'widgets';

import { FailedApplications } from './components/FailedApplications';
import { NoApplications } from './components/NoApplications';

export const Applications = () => {
  const isMainnet = useIsMainnet();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { isFetched: isGrowthDataFetched } = useSelector(
    growthMostUsedSelector
  );
  useFetchGrowthMostUsed();

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

  const is24hCountAvailable = isMainnet;

  if (!sort.sort && is24hCountAvailable) {
    sort.sort = 'transfersLast24h';
    sort.order = SortOrderEnum.desc;
  }

  const minSize = Math.min(size, 15);

  const fetchApplications = () => {
    setDataChanged(true);
    Promise.all([
      getAccounts({
        page,
        search,
        isSmartContract: true,
        withOwnerAssets: true,
        withDeployInfo: true,
        ...(is24hCountAvailable ? {} : { withScrCount: true }),
        ...(is24hCountAvailable ? { size } : { size: minSize }),
        ...sort
      }),
      getAccountsCount({ isSmartContract: true, search })
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
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <h5
                        data-testid='title'
                        className='table-title d-flex align-items-center'
                      >
                        Browse all deployed apps
                      </h5>
                      <Pager
                        total={totalAccounts}
                        itemsPerPage={is24hCountAvailable ? PAGE_SIZE : minSize}
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
                              <Sort id='balance' text='Balance' />
                            </th>
                            <th>
                              {is24hCountAvailable ? (
                                <Sort
                                  id='transfersLast24h'
                                  text='Transactions / 24h'
                                  defaultOrder={SortOrderEnum.desc}
                                  defaultActive
                                />
                              ) : (
                                'Transactions'
                              )}
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
                    <PageSize
                      defaultSize={is24hCountAvailable ? PAGE_SIZE : 15}
                      maxSize={PAGE_SIZE}
                    />
                    <Pager
                      total={totalAccounts}
                      itemsPerPage={is24hCountAvailable ? PAGE_SIZE : minSize}
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
      )}
    </div>
  );
};
