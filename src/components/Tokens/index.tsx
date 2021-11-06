import * as React from 'react';
import { Loader, adapter, NetworkLink, Trim, Pager } from 'sharedComponents';
import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import { urlBuilder, useFilters, useURLSearchParams, types, useActiveRoute } from 'helpers';
import Filters from './Filters';
import { useLocation } from 'react-router-dom';
import { tokensRoutes } from 'routes';

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

  React.useEffect(fetchTokens, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
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
                              Meta
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
                                <th>Owner</th>
                              </tr>
                            </thead>
                            <tbody data-testid="tokensTable">
                              {tokens.map((token, i) => (
                                <tr key={token.identifier}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <NetworkLink
                                        to={urlBuilder.tokenDetails(token.identifier)}
                                        data-testid={`tokensLink${i}`}
                                        className={`d-flex ${
                                          token.assets?.svgUrl ? 'token-link' : ''
                                        }`}
                                      >
                                        <div className="d-flex align-items-center">
                                          {token.assets && token.assets.svgUrl && (
                                            <img
                                              src={token.assets.svgUrl}
                                              alt={token.name}
                                              className="token-icon mr-1"
                                            />
                                          )}
                                          <div>{token.identifier}</div>
                                        </div>
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>{token.name}</td>
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
