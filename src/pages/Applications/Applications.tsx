import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as DefaultImage } from 'assets/img/default-icon.svg';
import {
  Loader,
  Pager,
  PageSize,
  FormatAmount,
  NetworkLink,
  Sort,
  AccountName,
  Overlay,
  TimeAgo,
  Trim,
  TableWrapper,
  InfoTooltip,
  ColSpanWrapper
} from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetPage,
  useGetSort,
  useHasGrowthWidgets,
  useFetchGrowthMostUsed,
  useGetSearch,
  useGetApplicationsFilters
} from 'hooks';
import { faBadgeCheck } from 'icons/solid';
import { activeNetworkSelector, growthMostUsedSelector } from 'redux/selectors';
import { ApplicationSortEnum, ApplicationType, SortOrderEnum } from 'types';
import { MostUsedApplications } from 'widgets';

import { ApplicationsFilters } from './components/ApplicationsFilters';
import { ApplicationsHeader } from './components/ApplicationsHeader';
import { ApplicationsTimelineFilterTabs } from './components/ApplicationsTimelineFilterTabs';
import { FailedApplications } from './components/FailedApplications';
import { NoApplications } from './components/NoApplications';

export const Applications = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { isFetched: isGrowthDataFetched } = useSelector(
    growthMostUsedSelector
  );

  const sort = useGetSort();
  const { search } = useGetSearch();
  const { page } = useGetPage();
  const applicationsFilters = useGetApplicationsFilters();
  const { getApplications, getApplicationsCount } = useAdapter();

  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [applicationsCount, setApplicationsCount] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);
  const [verifiedApplicationsCount, setVerifiedApplicationsCount] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  const { isVerified } = applicationsFilters;

  if (!sort.sort) {
    sort.sort = ApplicationSortEnum.transfersLast24h;
    sort.order = SortOrderEnum.desc;
  }

  useFetchGrowthMostUsed();

  const fetchApplications = () => {
    setDataChanged(true);
    Promise.all([
      getApplications({
        page,
        search,
        ...applicationsFilters,
        ...sort
      }),
      getApplicationsCount({
        search,
        ...applicationsFilters,
        isVerified: false
      }),
      getApplicationsCount({ search, ...applicationsFilters, isVerified: true })
    ])
      .then(
        ([
          applicationsData,
          applicationsCountData,
          verifiedApplicationsCountData
        ]) => {
          if (applicationsData.success && applicationsCountData.success) {
            setApplications(applicationsData.data);
            setApplicationsCount(applicationsCountData.data);
            setVerifiedApplicationsCount(verifiedApplicationsCountData.data);
          }
          setDataReady(
            applicationsData.success && applicationsCountData.success
          );
        }
      )
      .finally(() => {
        setDataChanged(false);
      });
  };

  const totalApplications = isVerified
    ? verifiedApplicationsCount
    : applicationsCount;

  useEffect(() => {
    fetchApplications();
  }, [activeNetworkId, searchParams]);

  if (dataReady === undefined || (hasGrowthWidgets && !isGrowthDataFetched)) {
    return <Loader />;
  }

  return (
    <div className='container page-content applications'>
      {hasGrowthWidgets && <MostUsedApplications className='mb-3' />}
      {dataReady === false && <FailedApplications />}

      {dataReady === true && (
        <div className='card'>
          <div className='card-header'>
            <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
              <ApplicationsHeader
                applicationsCount={applicationsCount}
                verifiedApplicationsCount={verifiedApplicationsCount}
              />
              <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 w-100'>
                <ApplicationsFilters
                  applicationsCount={applicationsCount}
                  verifiedApplicationsCount={verifiedApplicationsCount}
                />
                <ApplicationsTimelineFilterTabs />
              </div>
            </div>
          </div>

          <div className='card-body'>
            <TableWrapper dataChanged={dataChanged}>
              <table className='table applications-table mb-0'>
                <thead>
                  <tr>
                    <th>Name/Address</th>
                    <th className='transfers'>
                      <Sort
                        id='transfersLast24h'
                        text='Transactions'
                        defaultOrder={SortOrderEnum.desc}
                        defaultActive
                      />
                    </th>
                    <th className='users'>
                      <Sort id='usersCount' text='Users' />
                    </th>
                    <th className='balance'>
                      <Sort id='balance' text='Balance' />
                    </th>
                    <th className='fees'>Fees Captured</th>
                    <th className='developer-rewards'>Developer Rewards</th>
                    <th className='deployed'>Deployed</th>
                  </tr>
                </thead>
                <tbody data-testid='applicationsTable'>
                  {applications.length == 0 && (
                    <ColSpanWrapper colSpan={7}>
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
                        {formatBigNumber({
                          value: application.txCount
                        })}
                      </td>
                      <td className='text-neutral-100'>
                        {formatBigNumber({
                          value: application.usersCount
                        })}
                      </td>
                      <td className='text-neutral-100'>
                        <FormatAmount value={application.balance} />
                      </td>
                      <td className='text-neutral-100'>
                        <FormatAmount value={application.feesCaptured} />
                      </td>
                      <td className='text-neutral-100'>
                        <FormatAmount value={application.developerReward} />
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
                                      <Trim text={application.deployTxHash} />
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
            <Pager total={totalApplications} show={applications.length > 0} />
          </div>
        </div>
      )}
    </div>
  );
};
