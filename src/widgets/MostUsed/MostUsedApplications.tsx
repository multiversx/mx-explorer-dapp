import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Loader, ShowcaseCard, Trim, NetworkLink, TimeAgo } from 'components';
import { urlBuilder, addressIsBech32 } from 'helpers';
import { useIsMainnet, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { applicationsRoutes } from 'routes';
import { WithClassnameType } from 'types';

export interface MostUsedApplicationsUIType extends WithClassnameType {
  showDashboardLink?: boolean;
}

export const MostUsedApplications = ({
  showDashboardLink = false,
  className
}: MostUsedApplicationsUIType) => {
  const isMainnet = useIsMainnet();

  const { isFetched, dailyMostUsedApplications } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!isMainnet) {
    return null;
  }

  return (
    <>
      {isFetched ? (
        <div
          className={classNames(
            'most-used-applications card card-black',
            className
          )}
        >
          <div className='card-header'>
            <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
              <h5>
                Most Used Applications{' '}
                <span className='text-neutral-500 ms-1'>(daily)</span>
              </h5>
              {showDashboardLink && (
                <NetworkLink
                  to={applicationsRoutes.applications}
                  className='btn btn-sm btn-dark'
                >
                  View Dashboard
                </NetworkLink>
              )}
            </div>
          </div>

          <div className='card-body'>
            <div className='showcase-card-wrapper'>
              <div className='showcase-card-scroll d-flex flex-nowrap'>
                {dailyMostUsedApplications.map((contract) => {
                  const TitleLink = () => (
                    <NetworkLink
                      to={
                        addressIsBech32(contract.key)
                          ? urlBuilder.accountDetails(contract.key)
                          : ''
                      }
                      className={classNames('trim-wrapper', {
                        hash: !Boolean(contract?.extraInfo?.assets?.name),
                        'line-clamp-3': Boolean(
                          contract?.extraInfo?.assets?.name
                        )
                      })}
                    >
                      {contract.extraInfo?.assets?.name ?? (
                        <Trim text={contract.key} />
                      )}
                    </NetworkLink>
                  );

                  return (
                    <ShowcaseCard
                      title={<TitleLink />}
                      icon={
                        contract.extraInfo?.assets?.svgUrl ||
                        contract.extraInfo?.assets?.pngUrl
                      }
                      detailsTitle='Txn'
                      detailsValue={new BigNumber(contract.value).toFormat()}
                      detailsRank={contract.rank}
                      key={contract.key}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
