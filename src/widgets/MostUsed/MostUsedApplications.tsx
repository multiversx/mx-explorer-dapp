import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Loader, Overlay, ShowcaseCard, Trim, NetworkLink } from 'components';
import { urlBuilder, addressIsBech32 } from 'helpers';
import {
  useHasGrowthWidgets,
  useFetchGrowthMostUsed,
  useScollInView
} from 'hooks';
import { faAngleLeft, faAngleRight, faBadgeCheck } from 'icons/solid';
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
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isFetched, dailyMostUsedApplications } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();
  const {
    handleElementReference,
    handleNextArrowClick,
    handlePreviousArrowClick,
    showLeftInViewArrow,
    showRightInViewArrow
  } = useScollInView();

  if (!hasGrowthWidgets) {
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
              <div
                onClick={handlePreviousArrowClick}
                className={classNames('showcase-card-arrow left', {
                  show: showLeftInViewArrow
                })}
              >
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className='showcase-card-arrow-icon'
                />
              </div>

              <div
                onClick={handleNextArrowClick}
                className={classNames('showcase-card-arrow right', {
                  show: showRightInViewArrow
                })}
              >
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className='showcase-card-arrow-icon'
                />
              </div>

              <div className='showcase-card-scroll d-flex flex-nowrap'>
                {dailyMostUsedApplications.map((contract, contractIndex) => {
                  return (
                    <div
                      ref={handleElementReference}
                      data-index={contractIndex}
                      key={contract.key}
                      className='showcase-card-container'
                    >
                      <NetworkLink
                        to={
                          addressIsBech32(contract.key)
                            ? urlBuilder.accountDetails(contract.key)
                            : ''
                        }
                      >
                        <ShowcaseCard
                          title={
                            <span
                              className={classNames('trim-wrapper', {
                                hash: !Boolean(
                                  contract?.extraInfo?.assets?.name
                                ),
                                'line-clamp-3': Boolean(
                                  contract?.extraInfo?.assets?.name
                                )
                              })}
                            >
                              {contract.extraInfo?.assets?.name ?? (
                                <Trim text={contract.key} />
                              )}
                              {contract.extraInfo?.isVerified && (
                                <Overlay
                                  title='Verified'
                                  className='ms-1 d-inline-flex align-self-center'
                                >
                                  <FontAwesomeIcon
                                    icon={faBadgeCheck}
                                    size='2xs'
                                    className='text-primary'
                                  />
                                </Overlay>
                              )}
                            </span>
                          }
                          icon={
                            contract.extraInfo?.assets?.svgUrl ||
                            contract.extraInfo?.assets?.pngUrl
                          }
                          detailsTitle='Txn'
                          detailsValue={new BigNumber(
                            contract.value
                          ).toFormat()}
                          detailsRank={contract.rank}
                        />
                      </NetworkLink>
                    </div>
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
