import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/pro-regular-svg-icons/faDiamond';
import { useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { Loader, adapter, NetworkLink, Trim, Pager } from 'sharedComponents';
import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import {
  urlBuilder,
  useFilters,
  useURLSearchParams,
  types,
  useActiveRoute,
  amountWithoutRounding,
  stringIsFloat,
} from 'helpers';
import Filters from './Filters';

import { tokensRoutes } from 'routes';

// temporary validate price and market cap values to avoid issues like EGLDUSDC-594e5e or LP token issues like ISETEGLDLP-86715a
export const isValidDisplayPrice = (price: number) => {
  if (price && stringIsFloat(price.toString()) && price < 100000) {
    // smaller than $100k for token price
    return true;
  }
  return false;
};
export const isValidDisplayMarketCap = (marketCap: number) => {
  if (marketCap && stringIsFloat(marketCap.toString()) && marketCap < 10000000000) {
    // smaller than $10billion marketCap
    return true;
  }
  return false;
};

const Tokens = () => {
  const ref = React.useRef(null);
  const activeRoute = useActiveRoute();
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useFilters();
  const { getTokens, getTokensCount } = adapter();

  const [tokens, setTokens] = React.useState<types.TokenType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalTokens, setTotalTokens] = React.useState<number | '...'>('...');

  const fetchTokens = () => {
    const queryObject = getQueryObject();

    Promise.all([getTokens({ ...queryObject, size }), getTokensCount(queryObject)]).then(
      ([tokensData, count]) => {
        if (ref.current !== null) {
          if (tokensData.success) {
            setTokens(tokensData.data);
            setTotalTokens(Math.min(count.data, 10000));
          }
          setDataReady(tokensData.success && count.success);
        }
      }
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTokens, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="tokens container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex align-items-center justify-content-between">
                      <h6 data-testid="title">Tokens</h6>
                    </div>
                    <div className="card-header-item d-flex justify-content-between align-items-center">
                      <div className="nodes-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row">
                        <ul className="list-inline m-0">
                          <li className="list-inline-item my-1 my-md-0">
                            <NetworkLink
                              to={tokensRoutes.tokens}
                              className={`btn btn-sm btn-outline-light btn-pill mr-2 ${
                                activeRoute(tokensRoutes.tokens) ? 'active' : ''
                              }`}
                            >
                              Tokens
                            </NetworkLink>
                            <NetworkLink
                              to={tokensRoutes.tokensMeta}
                              className={`btn btn-sm btn-outline-light btn-pill mr-2 ${
                                activeRoute(tokensRoutes.tokensMeta) ? 'active' : ''
                              }`}
                            >
                              Meta-ESDT
                            </NetworkLink>
                          </li>
                        </ul>
                        <Filters />
                      </div>
                      {tokens && tokens.length > 0 && (
                        <div className="d-none d-sm-flex">
                          <Pager
                            page={String(page)}
                            total={
                              totalTokens !== '...' ? Math.min(totalTokens, 10000) : totalTokens
                            }
                            itemsPerPage={25}
                            show={tokens.length > 0}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {tokens && tokens.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Token</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Market Cap</th>
                                <th>Holders</th>
                                <th>Transactions</th>
                                <th>Owner</th>
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
                                            <img
                                              src={token.assets.svgUrl}
                                              alt={token.name}
                                              className="token-icon"
                                            />
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
                                  {token.price &&
                                  isValidDisplayPrice(token.price) &&
                                  token.marketCap &&
                                  isValidDisplayMarketCap(token.marketCap) ? (
                                    <>
                                      <td>${amountWithoutRounding(token.price.toString())}</td>
                                      <td>${amountWithoutRounding(token.marketCap.toString())}</td>
                                    </>
                                  ) : (
                                    <>
                                      <td></td>
                                      <td></td>
                                    </>
                                  )}
                                  <td>
                                    {token.accounts ? new BigNumber(token.accounts).toFormat() : 0}
                                  </td>
                                  <td>
                                    {token.transactions
                                      ? new BigNumber(token.transactions).toFormat()
                                      : 0}
                                  </td>
                                  <td>
                                    <div className="d-flex trim-size-xl">
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(token.owner)}
                                        className="trim-wrapper"
                                      >
                                        <Trim text={token.owner} dataTestId={`accountLink${i}`} />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer d-flex justify-content-end">
                        <Pager
                          page={String(page)}
                          total={totalTokens !== '...' ? Math.min(totalTokens, 10000) : totalTokens}
                          itemsPerPage={25}
                          show={tokens.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoTokens />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tokens;
