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
  InfoTooltip,
  TableSearch,
  ColSpanWrapper
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
import {
  activeNetworkSelector,
  growthEconomicsSelector,
  growthMostUsedSelector
} from 'redux/selectors';
import {
  AccountType,
  ApplicationSortEnum,
  ApplicationType,
  SortOrderEnum
} from 'types';
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
  const { applicationsDeployed } = useSelector(growthEconomicsSelector);

  const sort = useGetSort();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getApplications, getApplicationsCount } = useAdapter();

  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalApplications, setTotalApplications] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  if (!sort.sort) {
    sort.sort = ApplicationSortEnum.transfersLast24h;
    sort.order = SortOrderEnum.desc;
  }

  const minSize = Math.min(size, 15);

  useFetchGrowthMostUsed();

  const fetchApplications = () => {
    setDataChanged(true);
    Promise.all([
      getApplications({
        page,
        search,
        ...sort
      }),
      getApplicationsCount({ search })
    ])
      .then(([applicationsData, applicationsCountData]) => {
        if (applicationsData.success && applicationsCountData.success) {
          setApplications(applicationsData.data);
          setTotalApplications(applicationsCountData.data);
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
              <div className='card-header'>
                <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                  <h5
                    data-testid='title'
                    className='table-title d-flex align-items-center'
                  >
                    Browse all deployed apps
                  </h5>
                  <div className='filters application-filters me-auto'>
                    <TableSearch
                      className='input-group-sm'
                      searchValue={applicationsDeployed || totalApplications}
                      placeholderText='App'
                      name='applicationsSearch'
                    />
                  </div>
                  <Pager
                    total={totalApplications}
                    show={applications.length > 0}
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

                        <th>
                          <Sort id='balance' text='Balance' />
                        </th>
                        <th>
                          <Sort id='usersCount' text='Users Count' />
                        </th>
                        <th>
                          <Sort
                            id='transfersLast24h'
                            text='Transactions'
                            defaultOrder={SortOrderEnum.desc}
                            defaultActive
                          />
                        </th>
                        <th className='text-end'>Deployed</th>
                      </tr>
                    </thead>
                    <tbody data-testid='applicationsTable'>
                      {applications.length == 0 && (
                        <ColSpanWrapper colSpan={5}>
                          <NoApplications />
                        </ColSpanWrapper>
                      )}
                      {applications.map((application, i) => (
                        <tr key={application.address}>
                          <td>
                            <NetworkLink
                              to={urlBuilder.applicationDetails(
                                application.address
                              )}
                              data-testid={`applicationLink${i}`}
                              className='d-flex align-items-center trim-wrapper gap-2 hash hash-xxl'
                            >
                              {application.assets?.iconSvg ||
                              application.assets?.iconPng ? (
                                <img
                                  src={
                                    application.assets?.iconSvg ||
                                    application.assets?.iconPng
                                  }
                                  alt={application.assets?.name}
                                  className='side-icon side-icon-md-large'
                                />
                              ) : (
                                <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                                  <DefaultImage />
                                </div>
                              )}
                              <AccountName
                                address={application.address}
                                assets={application.assets}
                              />
                              {application.isVerified && (
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

                          <td className='text-neutral-100'>
                            <FormatAmount value={application.balance} />
                          </td>
                          <td>
                            {application.usersCount ? (
                              formatBigNumber({
                                value: application.usersCount
                              })
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td>
                            {application.txCount ? (
                              formatBigNumber({
                                value: application.txCount
                              })
                            ) : (
                              <>-</>
                            )}
                          </td>
                          <td className='text-end'>
                            {application.deployedAt ? (
                              <div className='d-flex align-items-center justify-content-end'>
                                <TimeAgo
                                  value={application.deployedAt}
                                  short
                                  showAgo
                                  tooltip
                                />
                                {application.deployTxHash && (
                                  <InfoTooltip
                                    title={
                                      <>
                                        <span className='text-neutral-400'>
                                          Deploy Transaction:
                                        </span>
                                        <NetworkLink
                                          to={urlBuilder.transactionDetails(
                                            application.deployTxHash
                                          )}
                                          data-testid='upgradeTxHashLink'
                                          className='trim-wrapper'
                                        >
                                          <Trim
                                            text={application.deployTxHash}
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
                <Pager
                  total={totalApplications}
                  show={applications.length > 0}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
