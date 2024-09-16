import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import {
  SocialIcons,
  SocialWebsite,
  HeroDetailsCard,
  FormatUSD,
  NativeTokenLogo
} from 'components';
import { useGetNativeTokenDetails } from 'hooks';

export const NativeTokenDetailsCard = () => {
  const {
    name,
    ticker,
    decimals,
    assets,
    price,
    marketCap,
    accounts,
    transactions,
    supply,
    circulatingSupply
  } = useGetNativeTokenDetails();

  const title = assets?.name ?? name;

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
    [assets]
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
      className='token-details'
      detailItems={detailItems}
      statsCards={statsCards}
      smallStatsCards={smallStatsCards}
    />
  );
};
