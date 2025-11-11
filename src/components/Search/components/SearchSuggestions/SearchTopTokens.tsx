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
    <div className='search-group search-top-tokens'>
      <div className='search-category'>
        Top Tokens<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostTransactedTokens
        .slice(0, 3)
        .map(({ key: identifier, value, extraInfo }) => {
          return (
            <NetworkLink
              to={urlBuilder.tokenDetails(identifier)}
              key={identifier}
              className='search-suggestion selectable'
            >
              <div className='search-text trim text-truncate'>
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
