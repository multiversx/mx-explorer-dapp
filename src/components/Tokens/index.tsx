import * as React from 'react';
import { Loader, adapter, NetworkLink, Trim, Pager } from 'sharedComponents';
import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import { urlBuilder, useFilters, useURLSearchParams } from 'helpers';
import Filters from './Filters';
import { useLocation } from 'react-router-dom';

export interface TokenTypeTMP {
  identifier: string;
  name: string;
  owner: string;
}

const Tokens = () => {
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useFilters();
  const { getTokens, getTokensCount } = adapter();

  const [tokens, setTokens] = React.useState<TokenTypeTMP[]>([]);
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
                    <div className="card-header-item">
                      <Filters />
                    </div>
                  </div>

                  {tokens && tokens.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Token</th>
                                <th>Owner Account</th>
                              </tr>
                            </thead>
                            <tbody data-testid="tokensTable">
                              {tokens.map((token, i) => (
                                <tr key={token.name}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <NetworkLink
                                        to={urlBuilder.tokenDetails(token.identifier)}
                                        data-testid={`tokensLink${i}`}
                                      >
                                        {token.name}
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>{token.identifier}</td>
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
