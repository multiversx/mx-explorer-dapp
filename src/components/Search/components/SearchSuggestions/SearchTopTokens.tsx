import { useSelector } from 'react-redux';

import { NetworkLink } from 'components';
import { urlBuilder, formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

export const SearchTopTokens = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostTransactedTokens } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-suggestions search-top-tokens'>
      <div className='table-wrapper animated-list'>
        <table className='table trim-size mb-0'>
          <thead>
            <tr>
              <th>App</th>
              <th className='text-end'>Txn</th>
            </tr>
          </thead>
          <tbody data-testid='topAppsTable'>
            {dailyMostTransactedTokens.map(
              ({ key: identifier, value, extraInfo }) => {
                return (
                  <tr key={identifier}>
                    <td>
                      <NetworkLink
                        to={urlBuilder.tokenDetails(identifier)}
                        className={`d-flex align-items-center symbol trim text-truncate text-primary-200 w-min-content ${
                          extraInfo?.assets?.svgUrl ? 'side-link' : ''
                        }`}
                      >
                        {extraInfo ? (
                          <>
                            {extraInfo?.assets?.svgUrl && (
                              <img
                                src={extraInfo?.assets.svgUrl}
                                className='side-icon me-1'
                                alt=''
                                role='presentation'
                              />
                            )}
                            <div className='text-truncate'>
                              {extraInfo?.name ? (
                                <>
                                  {extraInfo.name} ({extraInfo.ticker})
                                </>
                              ) : (
                                <>{identifier}</>
                              )}
                            </div>
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
