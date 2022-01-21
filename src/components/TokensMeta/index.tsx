import * as React from 'react';
import { Loader, adapter, NetworkLink, Trim, Pager } from 'sharedComponents';
import NoTokens from './NoTokens';
import FailedTokens from './FailedTokens';
import { urlBuilder, useFilters, useURLSearchParams, types, useActiveRoute } from 'helpers';
import Filters from './Filters';
import { useLocation } from 'react-router-dom';
import { tokensRoutes } from 'routes';

const TokensMeta = () => {
  const ref = React.useRef(null);
  const activeRoute = useActiveRoute();
  const { page } = useURLSearchParams();
  const { search } = useLocation();
  const { getQueryObject, size } = useFilters();
  const { getNfts, getNftsCount } = adapter();

  const [nfts, setNfts] = React.useState<types.NftType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalNfts, setTotalNfts] = React.useState<number | '...'>('...');

  const fetchNfts = () => {
    const queryObject = getQueryObject();
    const type = 'MetaESDT';

    Promise.all([
      getNfts({ ...queryObject, size, type }),
      getNftsCount({ ...queryObject, type }),
    ]).then(([nftsData, count]) => {
      if (ref.current !== null) {
        if (nftsData.success) {
          setNfts(nftsData.data);
          setTotalNfts(Math.min(count.data, 10000));
        }
        setDataReady(nftsData.success && count.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNfts, [search]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokens />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="tokens-meta container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex align-items-center justify-content-between">
                      <h6 data-testid="title">Meta-ESDT</h6>
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
                      {nfts && nfts.length > 0 && (
                        <div className="d-none d-sm-flex">
                          <Pager
                            page={String(page)}
                            total={totalNfts !== '...' ? Math.min(totalNfts, 10000) : totalNfts}
                            itemsPerPage={25}
                            show={nfts.length > 0}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {nfts && nfts.length > 0 ? (
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
                            <tbody data-testid="nftsTable">
                              {nfts.map((nft, i) => (
                                <tr key={`${nft.name}-${nft.identifier}`}>
                                  <td>
                                    <div className="token-identity d-flex flex-row">
                                      {nft.assets && nft.assets.svgUrl && (
                                        <div className="d-flex align-items-center mr-3">
                                          <NetworkLink
                                            to={urlBuilder.nftDetails(nft.identifier)}
                                            data-testid={`nftsLink${i}`}
                                            className="token-link"
                                          >
                                            <img
                                              src={nft.assets.svgUrl}
                                              alt={nft.name}
                                              className="token-icon"
                                            />
                                          </NetworkLink>
                                        </div>
                                      )}

                                      <div className="d-flex flex-column justify-content-center">
                                        <NetworkLink
                                          to={urlBuilder.nftDetails(nft.identifier)}
                                          data-testid={`nftsLink${i}`}
                                          className="d-block token-ticker"
                                        >
                                          {nft.identifier}
                                        </NetworkLink>
                                        {nft.assets && nft.assets.description && (
                                          <div className="token-description text-wrap text-secondary small d-none d-md-block">
                                            {nft.assets.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {nft.scamInfo ? `[Hidden - ${nft.scamInfo.info}]` : nft.name}
                                  </td>
                                  <td>
                                    <div className="d-flex trim-size-xl">
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(nft.creator)}
                                        className="trim-wrapper"
                                      >
                                        <Trim text={nft.creator} dataTestId={`accountLink${i}`} />
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
                          total={totalNfts !== '...' ? Math.min(totalNfts, 10000) : totalNfts}
                          itemsPerPage={25}
                          show={nfts.length > 0}
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

export default TokensMeta;
