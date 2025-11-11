import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { NetworkLink, Overlay } from 'components';
import { urlBuilder, formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { faHexagonCheck } from 'icons/solid';
import { growthMostUsedSelector } from 'redux/selectors';

export const SearchTopCollections = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostTransactedNFTs } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-group search-top-apps'>
      <div className='search-category'>
        Top NFT Collections<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostTransactedNFTs
        .slice(0, 3)
        .map(({ key: identifier, value, extraInfo }) => {
          return (
            <NetworkLink
              to={urlBuilder.collectionDetails(identifier)}
              key={identifier}
              className='search-suggestion selectable'
            >
              <div className='search-text trim text-truncate'>
                {extraInfo?.assets ? (
                  <>
                    {extraInfo.assets?.svgUrl && (
                      <img
                        src={extraInfo.assets.svgUrl}
                        className='side-icon me-1'
                        alt=''
                        role='presentation'
                      />
                    )}
                    <div className='text-truncate'>
                      {extraInfo?.name ? (
                        <>{extraInfo.name}</>
                      ) : (
                        <>{identifier}</>
                      )}
                    </div>
                    {extraInfo?.isVerified && (
                      <Overlay
                        title='Verified'
                        className='verified-badge-wrapper'
                      >
                        <FontAwesomeIcon
                          icon={faHexagonCheck}
                          size='sm'
                          className='text-yellow-spotlight ms-2'
                        />
                      </Overlay>
                    )}
                  </>
                ) : (
                  identifier
                )}
              </div>
              <div className='ms-auto'>{formatBigNumber({ value })}</div>
            </NetworkLink>
          );
        })}
    </div>
  );
};
