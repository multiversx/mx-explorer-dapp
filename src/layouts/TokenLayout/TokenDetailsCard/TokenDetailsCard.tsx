import { useRef } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import {
  AccountLink,
  SocialIcons,
  RolesBadges,
  SmallDetailItem,
  AssetsHelmet,
  LowLiquidityTooltip
} from 'components';
import { amountWithoutRounding } from 'helpers';

import { tokenSelector } from 'redux/selectors';

export const TokenDetailsCard = () => {
  const ref = useRef(null);

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
    marketCap,
    totalLiquidity,
    isLowLiquidity
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

  return identifier !== '' ? (
    <>
      <AssetsHelmet text='Token' assets={assets} ticker={ticker} name={name} />
      <div ref={ref}>
        <div className='token-details-card row mb-3'>
          <div className='col-12 col-lg-6 mb-spacer mb-lg-0'>
            <div className='card h-100'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center'>
                  <h1
                    className='h5 mb-0 d-flex align-items-center'
                    data-testid='title'
                  >
                    {assets && assets.svgUrl && (
                      <img
                        src={assets.svgUrl}
                        alt={ticker}
                        className='side-icon me-1'
                      />
                    )}
                    <span>{title}</span>
                  </h1>
                </div>
              </div>
              <div className='card-body'>
                <dl className='px-0'>
                  <SmallDetailItem title='Token'>{identifier}</SmallDetailItem>

                  {price && marketCap ? (
                    <>
                      <SmallDetailItem title='Price'>
                        ${amountWithoutRounding(price.toString(), 4)}
                      </SmallDetailItem>

                      <SmallDetailItem title='Market Cap'>
                        ${new BigNumber(marketCap).toFormat(0)}
                      </SmallDetailItem>

                      {totalLiquidity && (
                        <SmallDetailItem title='Total Liquidity'>
                          ${new BigNumber(totalLiquidity).toFormat(0)}
                          {isLowLiquidity && <LowLiquidityTooltip />}
                        </SmallDetailItem>
                      )}
                    </>
                  ) : (
                    <SmallDetailItem title='Supply'>
                      {new BigNumber(supply).toFormat()}
                    </SmallDetailItem>
                  )}

                  <SmallDetailItem title='Holders'>
                    {new BigNumber(accounts).toFormat()}
                  </SmallDetailItem>

                  <SmallDetailItem title='Transactions'>
                    {new BigNumber(transactions).toFormat()}
                  </SmallDetailItem>

                  <SmallDetailItem title='Properties'>
                    <RolesBadges {...token} />
                  </SmallDetailItem>
                </dl>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6'>
            <div className='card h-100'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center'>
                  <h5
                    data-testid='title'
                    className='table-title d-flex align-items-center'
                  >
                    Summary
                  </h5>
                </div>
              </div>
              <div className='card-body'>
                <dl className='px-0'>
                  <SmallDetailItem title='Owner'>
                    <AccountLink address={owner} />
                  </SmallDetailItem>

                  {supply && (
                    <SmallDetailItem title='Supply'>
                      {new BigNumber(supply).toFormat()}
                    </SmallDetailItem>
                  )}

                  {circulatingSupply && (
                    <SmallDetailItem title='Circulating'>
                      {new BigNumber(circulatingSupply).toFormat()}
                    </SmallDetailItem>
                  )}

                  <SmallDetailItem title='Decimals'>{decimals}</SmallDetailItem>

                  <SmallDetailItem title='Social'>
                    {Object.keys(mergedAssets).length > 0 ? (
                      <div className='d-flex h-100'>
                        <SocialIcons assets={mergedAssets} />
                      </div>
                    ) : (
                      <span className='text-neutral-400'>N/A</span>
                    )}
                  </SmallDetailItem>

                  <SmallDetailItem title='Description'>
                    {assets && assets.description ? (
                      <h2
                        className='token-description h6 mb-0'
                        title={assets.description}
                      >
                        {assets.description}
                      </h2>
                    ) : (
                      <span className='text-neutral-400'>N/A</span>
                    )}
                  </SmallDetailItem>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
