import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { tokensRoutes } from 'routes';
import { Loader, adapter, NetworkLink, Pager } from 'sharedComponents';
import { useGlobalState } from 'context';
import { useFilters, useURLSearchParams, types, useActiveRoute } from 'helpers';

import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import Filters from './Filters';
import TokensTable from './TokensTable';

const Tokens = () => {
  const ref = React.useRef(null);
  const { economics } = useGlobalState();
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
                      <div className="d-flex flex-wrap w-100 align-items-center justify-content-between">
                        <h6 data-testid="title">Tokens</h6>
                        <span>
                          {totalTokens}{' '}
                          <span className="text-secondary pr-2 border-right mr-2">Tokens</span>{' '}
                          <span className="text-secondary">Ecosystem Market Cap:</span>{' '}
                          {economics.ecosystemMarketCap}
                        </span>
                      </div>
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
                        <TokensTable tokens={tokens} page={page} />
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
