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
    <div className='search-group search-top-collections'>
      <div className='search-category'>
        Top Apps<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostUsedApplications
        .slice(0, 3)
        .map(({ key: address, value, extraInfo }) => {
          const icon = extraInfo?.assets?.svgUrl || extraInfo?.assets?.pngUrl;
          return (
            <NetworkLink
              to={urlBuilder.accountDetails(address)}
              key={address}
              className='search-suggestion selectable'
            >
              <div className='search-text trim text-truncate'>
                {icon ? (
                  <img
                    src={icon}
                    alt={extraInfo?.assets?.name}
                    className='side-icon me-1'
                    role='presentation'
                  />
                ) : (
                  <div className='side-icon me-1 d-flex align-items-center justify-content-center'>
                    <DefaultImage />
                  </div>
                )}
                <AccountName address={address} assets={extraInfo?.assets} />
                {extraInfo?.isVerified && (
                  <Overlay title='Verified'>
                    <FontAwesomeIcon
                      icon={faBadgeCheck}
                      size='sm'
                      className='text-primary'
                    />
                  </Overlay>
                )}
              </div>
              <div className='ms-auto'>{formatBigNumber({ value })}</div>
            </NetworkLink>
          );
        })}
    </div>
  );
};
