import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import {
  AccountLink,
  SocialIcons,
  SocialWebsite,
  RolesBadges,
  HeroDetailsCard,
  FormatUSD,
  LowLiquidityTooltip
} from 'components';

import { tokenSelector } from 'redux/selectors';

export const TokenDetailsCard = () => {
  const { token } = useSelector(tokenSelector);
  const {
    identifier,
    ticker,
    name,
    decimals,
    owner,
    assets,
    supply,
    circulatingSupply,
    accounts,
    transactions,
    price,
    marketCap
  } = token;

  const title = `${
    assets ? `${name} ${ticker !== name ? `(${ticker})` : ''}` : ticker
  } Token`;

  return (
    <HeroDetailsCard
      title={title}
      icon={assets?.svgUrl || assets?.pngUrl}
      seoDetails={{
        text: '',
        description: assets?.description,
        completeDetails: Boolean(assets)
      }}
      className='token-details'
      detailItems={[
        {
          ...(assets?.description
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
            : {})
        },
        {
          ...(assets?.website
            ? {
                title: 'Website',
                value: <SocialWebsite link={assets.website} />
              }
            : {})
        },
        {
          ...(assets?.social && Object.keys(assets.social).length > 0
            ? {
                title: 'Other Links',
                value: <SocialIcons assets={assets.social} excludeWebsite />
              }
            : {})
        },
        { title: 'Identifier', value: identifier },
        { title: 'Decimals', value: decimals },
        { title: 'Owner', value: <AccountLink address={owner} fetchAssets /> },
        { title: 'Properties', value: <RolesBadges {...token} /> }
      ]}
      statsCards={[
        ...(price && marketCap
          ? [
              {
                title: (
                  <>
                    Price <LowLiquidityTooltip token={token} className='ms-1' />
                  </>
                ),
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
        { title: 'Transactions', value: new BigNumber(transactions).toFormat() }
      ]}
      smallStatsCards={[
        {
          ...(supply
            ? {
                title: 'Supply',
                value: new BigNumber(supply).toFormat(0)
              }
            : {})
        },
        {
          ...(circulatingSupply
            ? {
                title: 'Circulating',
                value: new BigNumber(circulatingSupply).toFormat(0)
              }
            : {})
        }
      ]}
    />
  );
};
