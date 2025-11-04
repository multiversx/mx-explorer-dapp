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
    <div className='search-suggestions search-top-collections'>
      <div className='table-wrapper animated-list'>
        <table className='table trim-size mb-0'>
          <thead>
            <tr>
              <th>App</th>
              <th className='text-end'>Txn</th>
            </tr>
          </thead>
          <tbody data-testid='topAppsTable'>
            {dailyMostTransactedNFTs.map(
              ({ key: identifier, value, extraInfo }) => {
                return (
                  <tr key={identifier}>
                    <td>
                      <NetworkLink
                        to={urlBuilder.collectionDetails(identifier)}
                        className={`d-flex align-items-center symbol trim text-truncate text-primary-200 w-min-content ${
                          extraInfo?.assets?.svgUrl ? 'side-link' : ''
                        }`}
                      >
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
                          <div className='text-truncate'>{identifier}</div>
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
