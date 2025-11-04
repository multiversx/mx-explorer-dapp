import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import DefaultImage from 'assets/img/default-icon.svg';
import { Overlay, NetworkLink, AccountName } from 'components';
import { urlBuilder, formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { faBadgeCheck } from 'icons/solid';
import { growthMostUsedSelector } from 'redux/selectors';

export const SearchTopApps = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostUsedApplications } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-suggestions search-top-apps'>
      <div className='table-wrapper animated-list'>
        <table className='table trim-size mb-0'>
          <thead>
            <tr>
              <th>App</th>
              <th className='text-end'>Txn</th>
            </tr>
          </thead>
          <tbody data-testid='topAppsTable'>
            {dailyMostUsedApplications.map(
              ({ key: address, value, extraInfo }) => {
                const icon =
                  extraInfo?.assets?.iconSvg || extraInfo?.assets?.iconPng;
                return (
                  <tr key={address}>
                    <td>
                      <NetworkLink
                        to={urlBuilder.accountDetails(address)}
                        className='d-flex align-items-center trim-wrapper gap-2 hash hash-xxl'
                      >
                        {icon ? (
                          <img
                            src={icon}
                            alt={extraInfo?.assets?.name}
                            className='side-icon side-icon-md-large'
                          />
                        ) : (
                          <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                            <DefaultImage />
                          </div>
                        )}
                        <AccountName
                          address={address}
                          assets={extraInfo?.assets}
                        />
                        {extraInfo?.isVerified && (
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
                    <td>{formatBigNumber({ value })}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
