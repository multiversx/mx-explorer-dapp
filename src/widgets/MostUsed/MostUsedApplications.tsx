import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Loader, TopCard, Trim, NetworkLink, TimeAgo } from 'components';
import { urlBuilder, addressIsBech32 } from 'helpers';
import { useIsMainnet, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { applicationsRoutes } from 'routes';
import { WithClassnameType } from 'types';

export interface MostUsedApplicationsUIType extends WithClassnameType {
  size: 10 | 7;
  showDashboardLink?: boolean;
}

export const MostUsedApplications = ({
  size,
  showDashboardLink = false,
  className
}: MostUsedApplicationsUIType) => {
  const isMainnet = useIsMainnet();

  const { isFetched, dailyMostUsedApplications } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  const getCardSize = (index: number) => {
    if (size === 10) {
      if (index < 2) {
        return 'md';
      }
      return 'sm';
    }
    if (size === 7) {
      if (index === 0) {
        return 'lg';
      }
      if (index < 3) {
        return 'md';
      }
      return 'sm';
    }

    return 'sm';
  };

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

          <div className='card-body top-card-wrapper'>
            <div className='top-card-holder'>
              {dailyMostUsedApplications.map((contract, i) => {
                if (i >= size) {
                  return null;
                }
                const TitleLink = () => (
                  <NetworkLink
                    to={
                      addressIsBech32(contract.key)
                        ? urlBuilder.accountDetails(contract.key)
                        : ''
                    }
                    className={classNames('trim-wrapper', {
                      hash: !Boolean(contract?.extraInfo?.assets?.name)
                    })}
                  >
                    {contract.extraInfo?.assets?.name ?? (
                      <Trim text={contract.key} />
                    )}
                  </NetworkLink>
                );

                return (
                  <TopCard
                    size={getCardSize(i)}
                    title={<TitleLink />}
                    icon={
                      contract.extraInfo?.assets?.svgUrl ||
                      contract.extraInfo?.assets?.pngUrl
                    }
                    detailsTitle='Total Txn:'
                    detailsValue={new BigNumber(contract.value).toFormat()}
                    detailsRank={contract.rank}
                    key={contract.key}
                    {...(contract.extraInfo?.deployedAt
                      ? { footerTitle: 'Age' }
                      : {})}
                    {...(contract.extraInfo?.deployedAt
                      ? {
                          footerValue: (
                            <TimeAgo
                              value={contract.extraInfo?.deployedAt}
                              short
                              showAgo
                              tooltip
                            />
                          )
                        }
                      : {})}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
