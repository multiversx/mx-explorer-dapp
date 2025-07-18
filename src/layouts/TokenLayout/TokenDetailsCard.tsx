import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD } from 'appConstants';
import {
  AccountLink,
  SocialIcons,
  SocialWebsite,
  RolesBadges,
  HeroDetailsCard,
  FormatUSD,
  LowLiquidityTooltip,
  PriceSourceTooltip,
  Chart,
  NetworkLink
} from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { urlBuilder } from 'helpers';
import { tokenExtraSelector, tokenSelector } from 'redux/selectors';

export const TokenDetailsCard = () => {
  const { token } = useSelector(tokenSelector);
  const { tokenExtra } = useSelector(tokenExtraSelector);
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
    transfers,
    price,
    marketCap,
    isLowLiquidity
  } = token;

  const formattedName = `${name}${ticker !== name ? ` (${ticker})` : ''}`;
  const title = `${assets ? formattedName : ticker} Token`;
  const seoTitle = assets ? formattedName : '';

  const config: ChartConfigType[] = [
    {
      id: 'value',
      label: 'Price',
      stroke: 'url(#splitColor)',
      data: tokenExtra.priceHistory,
      yAxisConfig: {
        domain: ['auto', 'auto']
      }
    }
  ];

  const detailItems = [
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
    { title: 'Identifier', value: identifier },
    { title: 'Decimals', value: decimals },
    { title: 'Owner', value: <AccountLink address={owner} fetchAssets /> },
    { title: 'Properties', value: <RolesBadges {...token} /> }
  ];

  const statsCards = [
    ...(price && marketCap
      ? [
          {
            title: (
              <>
                Price
                <PriceSourceTooltip token={token} className='ms-1' />
                <LowLiquidityTooltip token={token} className='ms-1' />
              </>
            ),
            value: (
              <div className='d-flex flex-norwap align-items-start gap-1 mh-3 cursor-pointer'>
                <FormatUSD
                  value={price}
                  usd={1}
                  digits={4}
                  showPrefix={false}
                />
                {tokenExtra.priceHistory.length > 0 && (
                  <NetworkLink
                    to={urlBuilder.tokenDetailsAnalytics(identifier)}
                  >
                    <Chart.Line
                      className='mt-n1'
                      config={config}
                      hasDot={false}
                      hasAxis={false}
                      hasGrid={false}
                      hasTooltip={false}
                      height={48}
                      width={120}
                    ></Chart.Line>
                  </NetworkLink>
                )}
              </div>
            )
          },
          !isLowLiquidity ||
          new BigNumber(marketCap).isLessThan(
            LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
          )
            ? {
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
            : {}
        ]
      : []),
    { title: 'Holders', value: new BigNumber(accounts).toFormat() },
    {
      title: 'Transactions',
      value: new BigNumber(transfers || transactions || 0).toFormat()
    }
  ];

  const smallStatsCards = [
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
  ];

  return (
    <HeroDetailsCard
      title={title}
      icon={assets?.svgUrl || assets?.pngUrl}
      seoDetails={{
        title: seoTitle,
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
