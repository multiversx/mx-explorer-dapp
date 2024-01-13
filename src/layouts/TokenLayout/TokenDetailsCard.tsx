import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import {
  AccountLink,
  SocialIcons,
  RolesBadges,
  HeroDetailsCard
} from 'components';
import { amountWithoutRounding } from 'helpers';

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
  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  return (
    <HeroDetailsCard
      title={title}
      description={assets?.description}
      iconSvg={assets?.svgUrl}
      iconPng={assets?.pngUrl}
      seoDetails={{ text: '' }}
      className='token-details'
      detailItems={[
        {
          ...(mergedAssets
            ? {
                title: 'Social',
                value: <SocialIcons assets={mergedAssets} />
              }
            : {})
        },
        { title: 'Identifier', value: identifier },
        { title: 'Decimals', value: decimals },
        { title: 'Owner', value: <AccountLink address={owner} /> },
        { title: 'Properties', value: <RolesBadges {...token} /> }
      ]}
      statsCards={[
        {
          ...(price && marketCap
            ? {
                title: 'Price',
                value: <>${amountWithoutRounding(price.toString(), 4)}</>
              }
            : {})
        },
        {
          ...(price && marketCap
            ? {
                title: 'Market Cap',
                value: <>${new BigNumber(marketCap).toFormat(0)}</>
              }
            : {})
        },
        { title: 'Holders', value: new BigNumber(accounts).toFormat() },
        { title: 'Transactions', value: new BigNumber(transactions).toFormat() }
      ]}
      smallStatsCards={[
        {
          ...(supply
            ? {
                title: 'Supply',
                value: new BigNumber(supply).toFormat()
              }
            : {})
        },
        {
          ...(circulatingSupply
            ? {
                title: 'Circulating',
                value: new BigNumber(circulatingSupply).toFormat()
              }
            : {})
        }
      ]}
    />
  );
};
