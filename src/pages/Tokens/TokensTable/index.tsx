import * as React from 'react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/pro-regular-svg-icons/faDiamond';

import { NetworkLink, Denominate, Sort } from 'components';
import { urlBuilder, amountWithoutRounding, useGetFilters } from 'helpers';
import { TokenType, TokenSortEnum, SortOrderEnum } from 'types';
import { EgldRow } from './EgldRow';

export const TokensTable = ({
  tokens,
  totalTokens,
}: {
  tokens: TokenType[];
  totalTokens: '...' | number;
}) => {
  const { getQueryObject } = useGetFilters();
  const queryObject = getQueryObject();
  const { order } = queryObject;

  return (
    <div className="table-wrapper tokens-table">
      <table className="table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th data-testid={TokenSortEnum.price}>
              <Sort id={TokenSortEnum.price} field="Price" />
            </th>
            <th>Circulating Supply</th>
            <th data-testid={TokenSortEnum.marketCap}>
              <Sort id={TokenSortEnum.marketCap} field="Market Cap" />
            </th>
            <th data-testid={TokenSortEnum.accounts}>
              <Sort id={TokenSortEnum.accounts} field="Holders" />
            </th>
            <th data-testid={TokenSortEnum.transactions}>
              <Sort id={TokenSortEnum.transactions} field="Transactions" />
            </th>
          </tr>
        </thead>
        <tbody data-testid="tokensTable">
          {tokens.map((token, i) => (
            <React.Fragment key={token.identifier}>
              {typeof totalTokens === 'number' && (order ? order === SortOrderEnum.desc : true) && (
                <EgldRow tokens={tokens} index={i} totalTokens={totalTokens} />
              )}
              <tr>
                <td>
                  <div className="token-identity d-flex flex-row">
                    <div className="d-flex align-items-center me-3">
                      <NetworkLink
                        to={urlBuilder.tokenDetails(token.identifier)}
                        data-testid={`tokensLink${i}`}
                        className="side-link"
                      >
                        {token.assets && token.assets.svgUrl ? (
                          <img src={token.assets.svgUrl} alt={token.name} className="side-icon" />
                        ) : (
                          <div className="bg-light side-icon d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon icon={faDiamond} />
                          </div>
                        )}
                      </NetworkLink>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <NetworkLink
                        to={urlBuilder.tokenDetails(token.identifier)}
                        data-testid={`tokensLink${i}`}
                        className="d-block token-ticker"
                      >
                        {token.ticker}
                      </NetworkLink>
                      {token.assets && token.assets.description && (
                        <div
                          className="token-description text-wrap text-secondary small d-none d-md-block"
                          title={token.assets.description}
                        >
                          {token.assets.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{token.name}</td>
                <td>{token.price && <>${amountWithoutRounding(token.price.toString(), 2)}</>}</td>
                <td>
                  {token.circulatingSupply && (
                    <Denominate
                      showLabel={false}
                      value={token.circulatingSupply ? String(token.circulatingSupply) : '0'}
                      denomination={token.decimals}
                      decimals={0}
                    />
                  )}
                </td>
                <td>{token.marketCap && <>${new BigNumber(token.marketCap).toFormat(0)}</>}</td>
                <td>{token.accounts ? new BigNumber(token.accounts).toFormat() : 0}</td>
                <td>{token.transactions ? new BigNumber(token.transactions).toFormat() : 0}</td>
              </tr>
              {typeof totalTokens === 'number' && order === SortOrderEnum.asc && i !== 0 && (
                <EgldRow tokens={tokens} index={i} totalTokens={totalTokens} />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
