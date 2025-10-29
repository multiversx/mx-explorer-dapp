import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  SocialIcons,
  SocialWebsite,
  HeroDetailsCard,
  FormatUSD,
  NativeTokenLogo
} from 'components';
import { useGetNativeTokenDetails, useHasGrowthWidgets } from 'hooks';
import { growthPriceSelector } from 'redux/selectors';

export const NativeTokenDetailsCard = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const {
    name,
    ticker,
    decimals,
    assets,
    price: economicsPrice,
    marketCap: economicsMarketCap,
    accounts,
    transactions,
    supply,
    circulatingSupply
  } = useGetNativeTokenDetails();

  const { unprocessed: unprocessedGrowth, isDataReady: isGrowthFetched } =
    useSelector(growthPriceSelector);

  const title = assets?.name ?? name;

  // avoid differences between cached api calls
  const price =
    hasGrowthWidgets && isGrowthFetched
      ? unprocessedGrowth.currentPrice
      : economicsPrice;

  const marketCap =
    hasGrowthWidgets && isGrowthFetched
      ? unprocessedGrowth.marketCap
      : economicsMarketCap;

  const detailItems = useMemo(
    () => [
      assets?.description
        ? {
            title: 'Description',
            value: (
              <div
                className='description line-clamp-2'
                title={assets.description}
              >
                {assets.description}
              </div>
            )
          }
        : {},
      assets?.website
        ? {
            title: 'Website',
            value: <SocialWebsite link={assets.website} />
          }
        : {},
      assets?.social && Object.keys(assets.social).length > 0
        ? {
            title: 'Other Links',
            value: <SocialIcons assets={assets.social} excludeWebsite />
          }
        : {},
      !assets && ticker !== name ? { title: 'Name', value: name } : {},
      { title: 'Decimals', value: decimals }
    ],
    [assets, ticker, name]
  );

  const statsCards = useMemo(
    () => [
      ...(price && marketCap
        ? [
            {
              title: 'Price',
              value: (
                <FormatUSD
                  value={price}
                  usd={1}
                  digits={4}
                  showPrefix={false}
                />
              )
            },
            {
              title: 'Market Cap',
              value: (
                <FormatUSD
                  value={marketCap}
                  digits={0}
                  usd={1}
                  showPrefix={false}
                />
              )
            }
          ]
        : []),
      { title: 'Holders', value: new BigNumber(accounts).toFormat() },
      {
        title: 'Transactions',
        value: new BigNumber(transactions || 0).toFormat()
      }
    ],
    [price, marketCap, transactions, accounts]
  );

  const smallStatsCards = useMemo(
    () => [
      supply && new BigNumber(supply).isGreaterThanOrEqualTo(0)
        ? {
            title: 'Supply',
            value: new BigNumber(supply).toFormat(0)
          }
        : {},
      circulatingSupply &&
      new BigNumber(circulatingSupply).isGreaterThanOrEqualTo(0)
        ? {
            title: 'Circulating',
            value: new BigNumber(circulatingSupply).toFormat(0)
          }
        : {}
    ],
    [supply, circulatingSupply]
  );

  return (
    <HeroDetailsCard
      title={title}
      iconComponent={
        <NativeTokenLogo className='native-token-logo' role='presentation' />
      }
      seoDetails={{
        title,
        description: assets?.description,
        completeDetails: Boolean(assets)
      }}
      className='native-token-details'
      detailItems={detailItems}
      statsCards={statsCards}
      smallStatsCards={smallStatsCards}
    />
  );
};
