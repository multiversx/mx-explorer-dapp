import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { TOP_APPLICATIONS_DISPLAY_LIMIT } from 'appConstants';
import { Loader, TopCard, Trim, NetworkLink } from 'components';
import { urlBuilder, addressIsBech32 } from 'helpers';
import { useIsMainnet, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

export const MostUsedApplications = () => {
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
        <div className='row mb-3'>
          <div className='col-12'>
            <div className='card card-black'>
              <div className='card-header'>
                <div className='card-header-item'>
                  <h5>Most Used Applications</h5>
                </div>
              </div>

              <div className='card-body top-card-wrapper'>
                <div className='top-card-holder'>
                  {dailyMostUsedApplications.map((contract, i) => {
                    if (i >= TOP_APPLICATIONS_DISPLAY_LIMIT) {
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
                        {contract?.extraInfo?.assets?.name ?? (
                          <Trim text={contract.key} />
                        )}
                      </NetworkLink>
                    );

                    return (
                      <TopCard
                        size={i === 0 ? 'lg' : i < 3 ? 'md' : 'sm'}
                        title={<TitleLink />}
                        icon={contract?.extraInfo?.assets?.iconSvg}
                        detailsTitle='Total Txn:'
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
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
