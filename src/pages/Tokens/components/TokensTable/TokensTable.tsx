import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import {
  ELLIPSIS,
  LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
} from 'appConstants';
import {
  NetworkLink,
  FormatAmount,
  Sort,
  LowLiquidityTooltip,
  FormatUSD
} from 'components';
import { urlBuilder } from 'helpers';
import { useGetSort } from 'hooks';
import { faDiamond } from 'icons/regular';
import { TokenType, TokenSortEnum, SortOrderEnum } from 'types';
import { NativeTokenRow } from './NativeTokenRow';

export const TokensTable = ({
  tokens,
  totalTokens = ELLIPSIS
}: {
  tokens: TokenType[];
  totalTokens?: typeof ELLIPSIS | number;
}) => {
  const { order } = useGetSort();

  return (
    <div className='table-wrapper tokens-table'>
      <table className='table mb-0'>
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th data-testid={TokenSortEnum.price}>
              <Sort id={TokenSortEnum.price} text='Price' />
            </th>
            <th>Circulating Supply</th>
            <th data-testid={TokenSortEnum.marketCap}>
              <Sort id={TokenSortEnum.marketCap} text='Market Cap' />
            </th>
            <th data-testid={TokenSortEnum.accounts}>
              <Sort id={TokenSortEnum.accounts} text='Holders' />
            </th>
            <th data-testid={TokenSortEnum.transactions}>
              <Sort id={TokenSortEnum.transactions} text='Transactions' />
            </th>
          </tr>
        </thead>
        <tbody data-testid='tokensTable'>
          {tokens.length === 0 && (
            <NativeTokenRow tokens={tokens} index={1} totalTokens={1} />
          )}
          {tokens.map((token, i) => (
            <Fragment key={token.identifier}>
              {typeof totalTokens === 'number' &&
                (order ? order === SortOrderEnum.desc : true) && (
                  <NativeTokenRow
                    tokens={tokens}
                    index={i}
                    totalTokens={totalTokens}
                  />
                )}
              <tr>
                <td>
                  <div className='token-identity d-flex flex-row'>
                    <div className='d-flex align-items-center me-3'>
                      <NetworkLink
                        to={urlBuilder.tokenDetails(token.identifier)}
                        data-testid={`tokensLink${i}`}
                        className='side-link'
                      >
                        {token.assets && token.assets.svgUrl ? (
                          <img
                            src={token.assets.svgUrl}
                            alt={token.name}
                            className='side-icon side-icon-md-large'
                          />
                        ) : (
                          <div className='side-icon side-icon-md-large d-flex align-items-center justify-content-center'>
                            <FontAwesomeIcon icon={faDiamond} />
                          </div>
                        )}
                      </NetworkLink>
                    </div>
                    <div className='d-flex flex-column justify-content-center'>
                      <span className='d-flex align-items-center gap-2'>
                        <NetworkLink
                          to={urlBuilder.tokenDetails(token.identifier)}
                          data-testid={`tokensLink${i}`}
                          className='d-block token-ticker'
                        >
                          {token.ticker}
                        </NetworkLink>
                        <LowLiquidityTooltip token={token} />
                      </span>
                      {token.assets && token.assets.description && (
                        <div
                          className='token-description text-wrap text-neutral-400 small d-none d-md-block'
                          title={token.assets.description}
                        >
                          {token.assets.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{token.name}</td>
                <td>
                  {token.price && (
                    <FormatUSD value={token.price} usd={1} showPrefix={false} />
                  )}
                </td>
                <td>
                  {token.circulatingSupply && (
                    <FormatAmount
                      showLabel={false}
                      showSymbol={false}
                      value={
                        token.circulatingSupply
                          ? String(token.circulatingSupply)
                          : '0'
                      }
                      decimals={token.decimals}
                      showUsdValue={false}
                      digits={0}
                    />
                  )}
                </td>
                <td>
                  {token.marketCap &&
                    (!token.isLowLiquidity ||
                      new BigNumber(token.marketCap).isLessThan(
                        LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
                      )) && (
                      <>
                        <FormatUSD
                          value={token.marketCap}
                          usd={1}
                          digits={0}
                          showPrefix={false}
                        />
                      </>
                    )}
                </td>
                <td>
                  {token.accounts
                    ? new BigNumber(token.accounts).toFormat()
                    : 0}
                </td>
                <td>
                  {new BigNumber(
                    token.transfersCount || token.transactions || 0
                  ).toFormat()}
                </td>
              </tr>
              {typeof totalTokens === 'number' &&
                order === SortOrderEnum.asc &&
                i !== 0 && (
                  <NativeTokenRow
                    tokens={tokens}
                    index={i}
                    totalTokens={totalTokens}
                  />
                )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
