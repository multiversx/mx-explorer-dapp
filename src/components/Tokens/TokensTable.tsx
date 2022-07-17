import * as React from 'react';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/pro-regular-svg-icons/faDiamond';

import { NetworkLink, Denominate } from 'sharedComponents';
import { urlBuilder, amountWithoutRounding } from 'helpers';
import { TokenType } from 'helpers/types';

const TokensTable = ({ tokens }: { tokens: TokenType[] }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Holders</th>
            <th>Transactions</th>
            <th>Price</th>
            <th>Circulating Supply</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody data-testid="tokensTable">
          {tokens.map((token, i) => (
            <tr key={token.identifier}>
              <td>
                <div className="token-identity d-flex flex-row">
                  <div className="d-flex align-items-center mr-3">
                    <NetworkLink
                      to={urlBuilder.tokenDetails(token.identifier)}
                      data-testid={`tokensLink${i}`}
                      className="token-link"
                    >
                      {token.assets && token.assets.svgUrl ? (
                        <img src={token.assets.svgUrl} alt={token.name} className="token-icon" />
                      ) : (
                        <div className="bg-light token-icon d-flex align-items-center justify-content-center">
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
              <td>{token.accounts ? new BigNumber(token.accounts).toFormat() : 0}</td>
              <td>{token.transactions ? new BigNumber(token.transactions).toFormat() : 0}</td>
              <td>{token.price && <>${amountWithoutRounding(token.price.toString())}</>}</td>
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
              <td>
                {token.marketCap && <>${amountWithoutRounding(token.marketCap.toString())}</>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokensTable;
