import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, adapter, NetworkLink, Trim, Pager } from 'sharedComponents';
import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import { types, urlBuilder, useSize, useURLSearchParams } from 'helpers';

const Tokens = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { page } = useURLSearchParams();
  const { size } = useSize();
  const { getTokens, getTokensCount } = adapter();

  const [tokens, setTokens] = React.useState<types.TokenType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalTokens, setTotalTokens] = React.useState<number | '...'>('...');

  const fetchTokens = () => {
    getTokens(size).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setTokens(data);
        }
        setDataReady(success);
      }
    });
  };

  const fetchTokensCount = () => {
    getTokensCount().then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalTokens(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(() => {
    fetchTokens();
    fetchTokensCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Tokens</span>
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  {tokens && tokens.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Identifier</th>
                                <th>Owner Account</th>
                                {/* <th>Minted</th>
                                <th>Status</th> */}
                              </tr>
                            </thead>
                            <tbody data-testid="tokensTable">
                              {tokens.map((token, i) => (
                                <tr key={token.tokenIdentifier}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <NetworkLink
                                        to={urlBuilder.tokenDetails(token.tokenIdentifier)}
                                        data-testid={`tokensLink${i}`}
                                      >
                                        {token.tokenName}
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>{token.tokenIdentifier}</td>
                                  <td>
                                    <div className="d-flex">
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(token.ownerAddress)}
                                        className="trim-wrapper"
                                      >
                                        <Trim
                                          text={token.ownerAddress}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  {/* <td>{token.mintedValue}</td>
                                  <td>{token.isPaused ? 'Paused' : 'Active'}</td> */}
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
